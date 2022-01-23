const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');

// get all users
router.get('/', (req, res) => {
    console.log('==============');
    Post.findAll({
        // Specify the information about the posts to populate
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at'
            [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],

        // Order property assigned a nested array that orders by the created_at
        // column in descending order
        order: [['created_at', 'DESC']],
        // include property is expressed as an array of objects
        // to define the object we need a reference to the model and attributes
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    // create a Promise that captures the response from the
    // database call
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        // used where property to set value of id
        where: {
            id: req.params.id
        },
        // requesting the same attributes...
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at'
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        // ...including the username which requires a reference to the User
        // model using the include property
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    // expects {title, post_url, user_id}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
        });
});

// PUT /api/posts/upvote
// Uses two queries
// 1. using the Vote model to create a vot
// 2. querying on that post to get an updated vote count
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
//     // create the vote
//     Vote.create({
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//     }).then(() => {
//         return Post.findOne({
//             where: {
//                 id: req.body.post_id
//             },
//             attributes: [
//                 'id',
//                 'post_url',
//                 'title',
//                 'created_at',
//                 // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
//                 [
//                     sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id'),
//                     'vote_count'
//                 ]
//             ]
//         })
//     })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => res.json(err));
});

// because we'll be updting an existing entry, the idea is to first
// retrieve the post instance by id, then alter the value of the title
// on this instance of a post
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// deleting an entry
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})


module.exports = router;