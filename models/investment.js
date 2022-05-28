const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvestmentSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  incrementedAt: {
    type: Date,
    default: Date.now,
  },
  incrementAmount: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    require: [true, 'Please provide investor'],
    ref: 'User',
  },
  property: {
    type: Object,
  },
});

InvestmentSchema.pre('save', function (next) {
  const now = new Date();
  this.createdAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Investment', InvestmentSchema);
