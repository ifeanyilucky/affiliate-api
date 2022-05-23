const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authentication');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

router.route('/register').post(register);
router.route('/login').post(login);

module.exports = router;
