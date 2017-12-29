const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/user');

router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: 'Mail already used',
          });
        }
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        const USER = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        USER.save()
          .then(result => {
            res.status(201).json({
              message: 'User Created!',
              user: result,
            });
          })
          .catch(error =>
            res.status(500).json({
              error,
            }),
          );
      });
  });
});

router.post('/login', (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, response) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }
        if (response) {
          return res.status(200).json({
            message: 'Auth successful',
          });
        }
        return res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:userId', (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'User deleted',
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
