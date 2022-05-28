const mongoose = require('mongoose');

const IdentityVerification = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      maxLength: 50,
    },
    country: {
      type: String,
      required: [true, 'Please provide country'],
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
    },
    passport: {
      type: String,
    },
    city: {
      type: String,
    },
    street: String,
    zipCode: String,
    driverLicense: {
      type: String,
    },
    otherId: {
      type: String,
    },
    selfie: {
      type: String,
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Please provide your date of birth'],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tel: {
      type: String,
      minLength: 10,
      maxLength: 11,
      trim: true,
      required: [true, 'Please provide phone number'],
    },
    verified: {
      type: String,
      enum: ['true', 'false', 'pending'],
      default: 'pending',
      required: [true, 'Please provide verification status'],
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('IdentityVerification', IdentityVerification);
