const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    // When client makes a GET request to /api/users
    // we will select all users from the user table in the database
    // and send it back as JSON
    User.findAll({
        // prevents passwords from returning in the query
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
// Different from the .findAll() method
// in tht we're indicating we only want one piece of dta back
router.get('/:id', (req, res) => {
    // Passing an argument into the .findOne() method
    User.findOne({
        attributes: { exclude: ['password'] },
        // Using the where option to indicate we want to find
        // a user where its id value equals whatever req.params.id is
        where: {
            id: req.params.id
        }
    })
    // Because we're looking for one user there's the possibility
    // that we could accidentally search for a user
    // with a nonexistent id value
    .then(dbUserData =>{
        // if the .then() method returns nothing from the query
        // we send a 404 request status back to the client to
        // indicate everything's okay and they just asked
        //  for the wrong piece of data
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req,res) => {
    // expects {username: '', email: '', password: ''}
    // create method is used to insert data
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// Login route
router.post('/login', (req, res) => {
    // expects {email, password}, finds user with specified email
    User.findOne({
        where: {
            email: req.body.email
        }
    // result of the query is passed as dbUserData
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' })
            return;
        }

        // Verify user
        // Instance method was called on the user retrieved from the database
        // Instance method returns a Boolean which can be used in a conditional to
        // verify whether the user has been verified or not
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
            // If the match returns a false value, an error message is sent back to the client
            // and the return statement exits out of the function immediately
        }
        // if there is a match the conditional statement block is ignored
        res.json({ user: dbUserData, message: 'You are now logged in!' });
        
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    //  expects {username: '', email: '', password: ''}

    // if req.body has exact key/value pairs to match the model, `req.body`
    // can be used insted
    // Update method combines the parameters for creating/looking up dta
    // Pass in req.body to provide the new data we want
    // to use in the update
    User.update(req.body, {
        individualHooks: true,
        where: {
            // req.params.id indicates where exactly we
            // want that new data to be used
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // use the destroy method to delete data
    User.destroy({
        where: {
            // provide an identifier to indicate where exactly we would like to delete data from
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;