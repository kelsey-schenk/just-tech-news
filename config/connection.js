// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize('just_tech_news_db', process.env.DB_USER, '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;

// new Sequlize function accepts the database name, MySQl username and MySQL password (respectively) as parameters