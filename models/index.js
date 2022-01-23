// Importing the user model and exporting an object with it as a property
const User = require('./user');
const Post = require('./post');
const Vote = require('./vote');

// Define relationship between user and post
// Create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// defining the relationship of the Post model to the User
// A post can only belong to one user not many
Post.belongsTo(User, {
    foreignKey: 'user_id',
})

// with the belongsToMany methods
// we're allowing both the User and Post models to query each other's information
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };