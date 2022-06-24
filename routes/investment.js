const router = require('express').Router();
const {
  getAllInvestment,
  getSingleInvestment,
  createInvestment,
  chargeStatus,
  updateInvestment,
  sampleCharge,
  paymentHandler,
} = require('../controllers/investment');
const auth = require('../middlewares/authentication');

router.route('/').get(auth, getAllInvestment).post(auth, createInvestment);
router.route('/data/:id').get(getSingleInvestment);
router.route('/status').post(chargeStatus);
router.route('/update-investment/:id').patch(updateInvestment);
router.route('/sample-charge').get(sampleCharge);
router.route('/payment-handler').post(paymentHandler);

module.exports = router; 
