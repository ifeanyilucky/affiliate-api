const mongoose = require('mongoose');
const { Schema } = mongoose;

const withdrawalSchema = new Schema(
  {
    amount: {
      type: String,
      required: [true, 'Please provide charge'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide investor'],
      ref: 'User',
    },
    btcWalletAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'complete', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('withdrawal', withdrawalSchema);
