const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvestmentSchema = new Schema(
  {
    charge: {
      type: Object,
      required: [true, 'Please provide charge'],
    },
    ethToken: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      default: 3000,
    },
    user: {
      type: Schema.Types.ObjectId,
      require: [true, 'Please provide investor'],
      ref: 'User',
    },
    property: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', InvestmentSchema);
