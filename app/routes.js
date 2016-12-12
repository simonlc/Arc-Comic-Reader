import path from 'path';
import os from 'os';

import bodyParser from 'body-parser';
import passport from 'passport';
import bcrypt from 'bcrypt';
import P from 'bluebird';
import { Router } from 'express';
import { IncomingForm } from 'formidable';
import { unpack } from 'unpack-all';
import { exec } from 'mz/child_process';
import { unlink, rename, readdir, chmod } from 'mz/fs';

import User from './models/user';
import Comic, { Chapter } from './models/comic';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const unpackPromise = P.promisify(unpack);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(401);
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const router = Router();

router.post('/login',
  passport.authenticate('local'),
  (req, res) => res.json({
    id: req.user.id,
    username: req.user.username,
  }));

router.get('/logout',
  (req, res) => {
    req.logout();
    return res.end();
  });

router.post('/signup',
  async (req, res) => {
    const { username, password, password2 } = req.body;

    // TODO Trim whitespace?
    if (!username || !password || !password2) {
      return res.status(400).json({
        error: 'Please, fill in all the fields.',
      });
    }

    if (password !== password2) {
      return res.status(400).json({
        error: 'Please, enter the same password twice.',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      req.login(user,
        err => res.json(user)
        // TODO Handle error?
      );
    } catch (error) {
      return res.status(400).json({
        error: 'Please, choose a different username.',
      });
    }
  });

router.get('/users',
  isLoggedIn,
  async (req, res) => {
    const users = await User.findAll({
      attributes: ['username', ['createdAt', 'joined']],
    });
    return res.json(users);
  });

router.get('/comics',
  async (req, res) => {
    const comics = await Comic.findAll();
    return res.json(comics);
  });

router.get('/chapters/:comic',
  async (req, res) => {
    const comic = await Comic.findOne({
      where: {
        slug: req.params.comic,
      },
    });
    const chapters = await comic.getIssues();
    return res.json(chapters);
  });

router.post('/comics',
  // isLoggedIn,
  (req, res) => {
    // TODO security checks:
    //  - don't overwrite shit
    //  - white list files
    //  - block fork bombs
    //  - block executable code
    //  - Max size and max name size checks
    //  - Delete anything that's not an image
    //
    // Since we only want images, maybe do checks to clean the images?

    const form = new IncomingForm();

    // test for mulitple comics
    form.multiples = true;

    form.uploadDir = path.join(__dirname, 'uploads');

    form.parse(req, async (err, formFields, formFiles) => {
      const zip = formFiles.file;

      // TODO Get real base64 paths (find a huge number)
      // TODO Check base 64 for colisisons in comic model
      const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      const dir = path.join(form.uploadDir, id);

      // Simplify these and only look down one level
      const cmd = `find ${dir} -type f -exec mv {} ${dir} \\;`;
      const cmd2 = `find ${dir} -depth -exec rmdir {} \\;`;

      await unpackPromise(zip.path, {
        targetDir: dir,
        quite: true,
        forceDirectory: false,
        noDirectory: true,
        noRecursion: true,
      });

      await exec(cmd);
      await exec(cmd2);
      const files = await readdir(dir);
      await Promise.all(files.map(async file => {
        // TODO Normalize sequence, start with 0.jpg not 1
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        // Find the last match of /\d+/
        const match = name.match(/\d+(?!.*\d+)/);
        if (match === null) {
          await unlink(path.join(dir, file));
        } else {
          const pageNumber = parseInt(match[0], 10) + ext;
          await chmod(path.join(dir, file), 0o640);
          await rename(
            path.join(dir, file),
            path.join(dir, pageNumber),
          );
        }
      }));

      // TODO Error if we have a gap in the sequence from 0 to n

      await unlink(zip.path);

      const pages = files.length;
      const slug = slugify(formFields.title);
      try {
        const [ comic ] = await Comic.findOrCreate({
          where: {
            slug,
          },
          defaults: {
            title: formFields.title,
          },
        });
        const [ chapter ] = await Chapter.findOrCreate({
          where: {
            chapterNumber: formFields.chapter,
          },
          defaults: {
            key: id,
            pages,
          },
        });
        await comic.addIssue(chapter);

        // res.sendStatus(204);
        const issues = await comic.getIssues();
        res.json(issues);
      } catch (error) {
        console.log('Sequelize error', error);
      }
    });
  });

export default router;
