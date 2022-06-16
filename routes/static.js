const router = require('express').Router();
const {
  getStaticInvestments,
  getStaticWithdrawal,
} = require('../controllers/static');
const auth = require('../middlewares/authentication');

router.route('/investments').get(getStaticInvestments);
router.route('/withdrawals').get(getStaticWithdrawal);

module.exports = router;
