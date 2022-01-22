const { Model, DataTypes } = require('sequelize');
const sequelize = require ('../config/connection');

// create post model
class Post extends Model {}

// Define columns in the Post
// create fields/columns for Post model
Post.init(
    {
        // defining the Post schema
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // References property used to establish the relationship
            // between this post and the user by creating a reference to the User model
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;