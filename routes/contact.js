const router = require('express').Router();
const Contact = require('../controllers/contact');

router.route('/').post(Contact);

module.exports = router;
