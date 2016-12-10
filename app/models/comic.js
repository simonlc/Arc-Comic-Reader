import Sequelize from 'sequelize';
import db from '../db';

export const Chapter = db.define('chapter', {
  chapterNumber: {
    type: Sequelize.INTEGER,
  },
  pages: {
    type: Sequelize.INTEGER,
  },
  key: {
    type: Sequelize.STRING,
  },
});

const Comic = db.define('comic', {
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9-_]+$/,
      notEmpty: true,
      max: 50,
    },
  },
  title: {
    type: Sequelize.STRING,
  },
});

Comic.hasMany(Chapter, {as: 'Issues'});

// Chapter.sync({ force: true });
Chapter.sync();
// Comic.sync({ force: true });
Comic.sync();

export default Comic;
