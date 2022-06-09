const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('../errors');
const sendEmail = require('../utils/sendEmail');
const shortid = require('shortid');

// USER REGISTRATION CONTROLLER
const register = async (req, res) => {
  // Check if user already exists
  const { email, role, firstName } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    throw new BadRequestError('Another user with this email already exists.');
  }
  const welcomeMsg = `
  <!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Welcome Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap"
        rel="stylesheet">
    <style type="text/css">
        body,
        table,
        td,
        a {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
        }

        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        table {
            border-collapse: collapse !important;
        }

        a {
            color: black;
        }

        img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
        }
    </style>

</head>

<body style="background-color: #D2C7BA;">
    <div class="preheader"
        style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to Lemox, ${firstName}!
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                            <a href="https://lemox.co" target="_blank" rel="noopener noreferrer"
                                style="display: inline-block;">
                                <!-- <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48"
                                    style="display: block; width: 48px; max-width: 48px; min-width: 48px;"> -->
                                <h1 style="font-family: 'DM serif display', serif ; color: #1b1642; margin: 0 ">Lemox.
                                </h1>
                            </a>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->

                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 24px; font-size: 16px; line-height: 24px;">
                            <h1
                                style="margin: 0 0 12px; font-family: 'DM Serif Display', serif; font-size: 32px; font-weight: 400; line-height: 48px;">
                                Welcome, ${firstName}!</h1>

                            <p style="font-family: 'DM Sans', sans-serif; margin: 0;">
                                Your journey to building your portfolio starts today!</p>
                            <p style="font-family: 'DM Sans', sans-serif;">

                                We're super excited to have you on-board, ${firstName}!
                                You can access your account area to start ID verification,
                                change your password, and more at:
                                <a href="https://lemox.co/dashboard/account-details"
                                    target="_blank">https://lemox.co/dashboard/account-details</a>
                            </p>
                            <p style="font-family: 'DM Sans', sans-serif; margin: 0;">

                                To start building your portfolio, head to: <a href="https://lemox.co/marketplace/"
                                    target="_blank">https://lemox.co/marketplace/</a>
                                <strong>Welcome to the future of real estate!</strong>
                            </p>
                        </td>
                    </tr>

                </table>
                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <!-- end copy block -->

        <!-- start footer -->
        <tr>
            <td align="center" bgcolor="#D2C7BA" style="padding: 24px;">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" bgcolor="#D2C7BA"
                            style="padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">Got a question? <a href="https://lemox.co/contact"
                                    target="_blank">Send us a message</a></p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <!-- end footer -->

    </table>
    <!-- end body -->

</body>

</html>
  `;
  if (role === 'investor') {
    await sendEmail({
      from: `Lemox Team <support@lemox.co>`,
      to: email,
      subject: 'Welcome to Lemox!',
      text: welcomeMsg,
    });
  }
  const uniqueId = shortid.generate();
  const result = await User.create({
    ...req.body,
    referralCode: uniqueId,
  });
  const token = result.createJWT();
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

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne(email);
  if (!user) {
    throw new NotFoundError(`${email} is not found`);
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  const resetUrl = `http://lemox.co/auth/reset-password/${resetToken}`;

  // message that will be sent to the user when resetting password
  const message = `
  <!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Welcome Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap"
        rel="stylesheet">
    <style type="text/css">
        body,
        table,
        td,
        a {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
        }

        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        table {
            border-collapse: collapse !important;
        }

        a {
            color: black;
        }

        img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
        }
    </style>

</head>

<body style="background-color: #D2C7BA;">
    <div class="preheader"
        style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Welcome to Lemox, Jason!
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                            <a href="https://lemox.co" target="_blank" rel="noopener noreferrer"
                                style="display: inline-block;">
                                <!-- <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48"
                                    style="display: block; width: 48px; max-width: 48px; min-width: 48px;"> -->
                                <h1 style="font-family: 'DM serif display', serif ; color: #1b1642; margin: 0 ">Lemox.
                                </h1>
                            </a>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->

                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#D2C7BA">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 24px; font-size: 16px; line-height: 24px;">


                            <p style="font-family: 'DM Sans', sans-serif; margin: 0;">
                                Someone has requested a new password for the following account on Lemox:
                            </p>
                            <p style="font-family: 'DM Sans', sans-serif;">
                                Username: wfguru2017
                            </p>
                            <p style="font-family: 'DM Sans', sans-serif; margin: 0;">

                                If you didn't make this request, please ignore this email. If you'd like to proceed:
                            </p>
                            <p style="font-family: 'DM Sans', sans-serif; margin: 0;">
                                <a href="${resetUrl}"
                                    target="_blank">${resetUrl}</a>
                            </p>
                        </td>
                    </tr>

                </table>
                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <!-- end copy block -->

        <!-- start footer -->
        <tr>
            <td align="center" bgcolor="#D2C7BA" style="padding: 24px;">
                <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" bgcolor="#D2C7BA"
                            style="padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">Got a question? <a href="https://lemox.co/contact"
                                    target="_blank">Send us a message</a></p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#D2C7BA"
                            style="padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">DM Sans 12sans-34 S. Broadway St. City, State 12345</p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
        </tr>
        <!-- end footer -->

    </table>
    <!-- end body -->

</body>

</html>
  `;

  try {
    await sendEmail({
      from: `Lemox Support <support@lemox.co>`,
      to: user.email,
      subject: 'Forgot your password?',
      text: message,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Sent successfully!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    await user.save();
    throw new BadRequestError('Email could not be sent');
  }
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
  changePassword,
};
