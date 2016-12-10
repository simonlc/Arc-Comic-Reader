import Sequelize from 'sequelize';
import db from '../db';

const User = db.define('user', {
  // Username, 15char limit, case insensitive, a-z 0-9 _
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9_]+$/i,
      notEmpty: true,
      max: 15,
    },
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  realName: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
});

// User.sync({ force: true });
User.sync();

export default User;
