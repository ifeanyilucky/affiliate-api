const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('../errors');
const sendEmail = require('../utils/sendEmail');
const config = require('../config');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');

// USER REGISTRATION CONTROLLER
const register = async (req, res) => {
  // Check if user already exists
  const { email, role, firstName, lastName } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    throw new BadRequestError('Another user with this email already exists.');
  }

  const uniqueId = shortid.generate();
  const result = await User.create({
    ...req.body,
    referralCode: uniqueId,
    firstName: firstName,
    lastName: lastName,
  });
  const token = result.createJWT();

  ejs.renderFile(
    path.join(__dirname, '../views/email/welcome.ejs'),
    {
      config,
      title: 'Welcome to our Referral program',
      firstName: firstName,
    },
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        await sendEmail({
          from: `Lemox Support <support@lemox.co>`,
          to: email,
          subject: 'Welcome to our Referral program',
          text: data,
        });
      }
    }
  );

  res.status(StatusCodes.CREATED).json({ result, token, role });
};

// USER LOGIN CONTROLLER
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError(
      "Sorry, we couldn't find an account with that email."
    );
  }
  const verificationToken = user.generateVerificationToken();
  const url = `${config.website}/auth/verify/${verificationToken}`;
  if (user.verified === false) {
    ejs.renderFile(
      path.join(__dirname, '../views/email/verify.ejs'),
      {
        config: config,
        title: 'Verify your email',
        url,
      },
      async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          await sendEmail({
            from: `Lemox Support <support@lemox.co>`,
            to: email,
            subject: 'Verify your email',
            text: data,
          });
        }
      }
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);
  // compare password

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      `Sorry, that password isn't right. We can help you <a href="/auth/login/forgot-password" class="api-link">recover your password</a>`
    );
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    result: user,
    token,
  });
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;
  if (!token) throw new NotFoundError('Missing Token');

  let payload = null;
  payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  console.log(payload);

  const user = await User.findOne({ _id: payload.userId });
  if (!user) throw new NotFoundError('User not found');
  user.verified = true;

  await user.save();

  ejs.renderFile(
    path.join(__dirname, '../views/email/signup-success.ejs'),
    {
      config,
      title: 'Your email has been verified',
      firstName: user.firstName,
    },
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        await sendEmail({
          from: `Lemox Support <${config.email.support}>`,
          to: user.email,
          subject: 'Your email has been verified',
          text: data,
        });
      }
    }
  );

  res.status(StatusCodes.ACCEPTED).json(user);
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFoundError(`${email} is not found`);
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  const url = `${config.website}/auth/reset-password/${resetToken}`;

  // message that will be sent to the user when resetting password
  ejs.renderFile(
    path.join(__dirname, '../views/email/forgot-password.ejs'),
    { config, title: 'Reset your password', email, url },
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        await sendEmail({
          from: `Lemox Support <${config.email.support}>`,
          to: email,
          subject: 'Reset your password',
          text: data,
        });
      }
    }
  );
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const {
    params: { token },
    body: { password },
  } = req;
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new BadRequestError('Invalid reset token');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: 'Password reset success' });
};

const editProfile = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: id },
    { ...req.body, verified: verified },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!user) {
    throw new NotFoundError('user not found with this ID');
  }
  res.status(StatusCodes.OK).json(user);
};

const changePassword = async (req, res) => {
  const { oldPassword, password } = req.body;
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) throw new NotFoundError('User not found');
  const isPasswordCorrect = user.comparePassword(oldPassword);
  if (!isPasswordCorrect)
    throw new BadRequestError('Old password is not correct');
  const salt = await bcrypt.genSalt(10);
  const modifiedPassword = await bcrypt.hash(password, salt);
  const userAccount = await User.findOneAndUpdate(
    { _id: id },
    { password: modifiedPassword },
    { new: true }
  );
  res.status(StatusCodes.ACCEPTED).json(userAccount);
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  editProfile,
  verifyAccount,
  changePassword,
};
