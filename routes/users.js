const router = require('express').Router();
const { getUsers, getUser } = require('../controllers/users');
const auth = require('../middlewares/authentication');

router.route('/').get(getUsers);
router.route('/:id').get(auth, getUser);

module.exports = router;
