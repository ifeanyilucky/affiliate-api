const router = require('express').Router();
const {
  getAllInvestment,
  getSingleInvestment,
  createInvestment,
  chargeStatus,
  updateInvestment,
} = require('../controllers/investment');
const auth = require('../middlewares/authentication');

router.route('/').get(auth, getAllInvestment).post(auth, createInvestment);
router.route('/data/:id').get(getSingleInvestment);
router.route('/status').post(chargeStatus);
router.route('/update-investment/:id').patch(updateInvestment);

module.exports = router;
