import Sequelize from 'sequelize';

module.exports = new Sequelize('database', null, null, {
  dialect: 'sqlite',
  storage: '../db.sqlite',
  logging: false,
});
