const router = require('express').Router();
const getStaticInvestments = require('../controllers/static');
const auth = require('../middlewares/authentication');

router.route('/investments').get(getStaticInvestments);

module.exports = router;
