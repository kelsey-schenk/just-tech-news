// Importing the user model and exporting an object with it as a property
const User = require('./user');
const Post = require('./post');

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

module.exports = { User, Post };