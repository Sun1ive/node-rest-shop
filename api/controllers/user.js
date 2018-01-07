const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const JWT_KEY = 'Secret';

exports.user_sign_up = (req, res) => {
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
        return true;
      });
  });
};

exports.user_sign_in = (req, res) => {
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
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            JWT_KEY,
            {
              expiresIn: '1h',
            },
          );
          return res.status(200).json({
            message: 'Auth successful',
            token,
          });
        }
        return res.status(401).json({
          message: 'Auth failed',
        });
      });
      return true;
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_delete = (req, res) => {
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
};
