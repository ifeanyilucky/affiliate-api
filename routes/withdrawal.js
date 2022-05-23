const router = require('express').Router();
const auth = require('../middlewares/authentication');
const {
  getAllWithdrawal,
  getSingleWithdrawal,
  withdrawFunds,
} = require('../controllers/withdrawal');

router.route('/').get(auth, getAllWithdrawal).post(auth, withdrawFunds);
router.route('/:id').get(auth, getSingleWithdrawal);

module.exports = router;
