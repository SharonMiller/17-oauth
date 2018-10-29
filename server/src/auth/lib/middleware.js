'use strict';

import User from '../model.js';


export default (req, res, next) => {
  let authorize = (token) => {
    User.authorize(token)
      .then(user => {
        if (!user) {
          console.log('not user');
        } else {
          console.log(user);
          req.user = user;
          next();
        }
      })
      .catch(next);
  };
  let authenticate = (auth) => {
    //validating the user using the model's authenticate method
    User.authenticate(auth)
      //get back a user from mongo either real or null
      .then(user => {
        // if null, got to gethAuth(), which should return an error or login page
        if (!user) {
          throw console.error('user not authorized');
        } else {
          req.token = user.generateToken();
          next();
        }
      })
      .catch(next);
  };
  //authenticate and parse headers
  try {
    let auth = {};
    let authHeader = req.headers.authorization;

    if (!authHeader) {
      console.error('not authorized');
    }

    //Basic Auth
    if (authHeader.match(/basic/i)) {
      //break up base64 string
      let base64Header = authHeader.replace(/Basic\s+/i, '');
      let base64Buffer = Buffer.from(base64Header, 'base64');
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');
      auth = { username, password };
      authenticate(auth);

    } else if (authHeader.match(/bearer/i)) {
      let token = authHeader.replace(/bearer\s+/i, '');
      authorize(token);
    }
  } catch (e) {
    next(e);
  }

};