'use strict';

import express from 'express';
const router = express.Router();
import authorize from '../auth/lib/oauth.js';
import User from '../auth/model.js';
import auth from '../auth/lib/middleware.js';
import Player from '../models/player';

router.post('/register', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then(user => res.send(user.generateToken()))
    .catch(next);
});

router.get('/signin', auth, (req, res, next) => {
  res.cookie('token', req.token);
  res.send(req.token);
});

router.get('/oauth', (req, res, next) => {
  console.log(req.query);

  authorize(req)
    .then(token => {
      res.cookie('token', token);
      res.redirect(process.env.REDIRECT_CLIENT_URI);

    })

    .catch(error => error);

});

router.get('/player/get/:id', auth, (req, res, next) => {
  let query = { _id: req.params.id };
  Player.findById(query)
    .then(data => {
      res.send(data);
    })
    .catch(next);
});

router.post('/player', auth, (req, res, next) => {
  console.log('posting new player');
  let player = new Player(req.body);
  player.save()
    .then(data => res.json(data))
    .catch(next);
});

router.put('/player/put/:id', auth, (req, res, next) => {
  console.log('updating player');

  Player.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(data => res.json(data))
    .catch(next);

});

router.delete('/player/delete/:id', auth, (req, res, next) => {
  console.log('deleting player');
  Player.findOneAndDelete({ _id: req.params.id })
    .then(data => {
      res.send(data);
    })
    .catch(next);

});

router.all('*', (req, res, next) => {
  res.status(404).send('Bad request').end();
});

export default router;