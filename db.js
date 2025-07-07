// db.js
const { Sequelize } = require('sequelize');

// SQLite DB file will be created as 'database.sqlite' in root directory
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

module.exports = sequelize;

