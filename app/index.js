import path from 'path';

import express from 'express';
import session from 'express-session';
// import bodyParser from 'body-parser';

import passport from 'passport';
import apiRouter from './routes';

import './passport';

const app = express();

// XXX Example code for storing session in db rather than in memory
// const RedisStore = require('connect-redis')(session);
// app.use(session({
//   store: new RedisStore({
//     url: config.redisStore.url,
//   }),
//   // TODO Use .env
//   secret: config.redisStore.secret,
//   resave: false,
//   saveUninitialized: false,
// }))

// Development
app.use(express.static('./public'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(session({ secret: 'keyboard dog', resave: false, saveUninitialized: false }));

// TODO Don't use bodyparser globably
// app.use(bodyParser.urlencoded({
//   extended: false,
// }));
// app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

/**
 * "API" Route for most of our app
 */
app.use('/api', apiRouter);

/**
 * Basic page to attach our React app to
 */
app.get('/*', (req, res) => {
  res.send(`<link rel=stylesheet href=/main.css><body><div id=root></div>
    <script src=/bundle.js></script>`);
});

app.listen(3000);
