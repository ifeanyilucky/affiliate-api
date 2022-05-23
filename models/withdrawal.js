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
      require: [true, 'Please provide investor'],
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('withdrawal', withdrawalSchema);
