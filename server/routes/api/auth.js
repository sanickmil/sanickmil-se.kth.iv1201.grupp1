const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const router = express.Router();
const dbservice = require('../../integration/database-services.js');

/**
 * Authenticates a user and provides a cookie proving authentication
 */
router.get('/', async (req, res) => {
  // TODO: Input validation here
  let username = req.query.username;
  let password = req.query.password;

  let authenticated = null;
  try {
    authenticated = await dbservice.authenticateUser(username, password);
  } catch (err) {
    return res.status(500).json({message: 'There are no users with that username'});
  }
  if (!authenticated) {
    return res.status(401).json({
      message: 'Wrong username or password'
    });
  }

  try {
    const authenticatedUser = await dbservice.getBasicUserInfoByUsername(username);

    const token = jwt.sign({
      user: authenticatedUser.username,
      role: authenticatedUser.role
    }, config.SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({
      message: 'Successfully logged in',
      access_token: token,
      token_type: 'Bearer',
      username: authenticatedUser.username,
      role: authenticatedUser.role
    });
  } catch (err) {
    console.log('Token error kinda', err);
    return res.status(500).json({message: 'Database communcation error'});
  }
})

/**
 * TODO: If the token is decided to be a Authorization header instead, remove this.
 * Deletes the jwt token cookie
 */
router.delete('/', async (req, res) => {
  let token = req.cookies.jwtToken;
  if (token) {
    res.clearCookie('jwtToken')
    res.clearCookie('savedState')
  }
  res.status(200).json({
    message: 'Successfully logged out.'
  });
})

module.exports = router;