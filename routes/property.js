const router = require('express').Router();
const {
  createProperty,
  getProperties,
  getSingleProperty,
} = require('../controllers/investment');

router.route('/').post(createProperty).get(getProperties);
router.route('/:id').get(getSingleProperty);

module.exports = router;
