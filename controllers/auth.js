const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const fs = require('fs');
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
    <title> 👋 Welcome to Thebrick!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 400;
                src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }

            @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 700;
                src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
        }

        body,
        table,
        td,
        a {
            -ms-text-size-adjust: 100%;
            /* 1 */
            -webkit-text-size-adjust: 100%;
            /* 2 */
        }

        table,
        td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /**
   * Remove blue links for iOS devices.
   */
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
            color: #135bfd;
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

<body style="background-color: #e9ecef;">
    <!-- start preheader -->
    <div class="preheader"
        style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        👋 Welcome to Thebrick!
    </div>
    <!-- end preheader -->
    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- start logo -->
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                            <a href="https://thebrick.com.ng" target="_blank" style="display: inline-block;">
                                <img src="https://res.cloudinary.com/thebrick-realty/image/upload/v1643146881/thebrick.com.ng/thebrick_sy7yab.png"
                                    alt="Logo" border="0" width="48"
                                    style="display: block; width: 150px; max-width: 250px; min-width: 150px;">
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="left" bgcolor="#ffffff"
                            style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                            <h4
                                style="margin: 0; font-size: 42px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                Make yourself at home
                            </h4>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td align="left" bgcolor="#ffffff"
                        style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                        <p style="margin: 0;">Welcome, ${firstName}. Now you're just one step away from finding your new
                            hostel
                            easily and safely. Make yourself at home, your new adventure begins!</p>
                    </td>
                </tr>
                <tr>
                    <td align="left" bgcolor="#ffffff">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="left" bgcolor="#135bfd" style="border-radius: 6px;">
                                                <a href="https://thebrick.com.ng/hostels" target="_blank"
                                                    style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                                    Explore hostels</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>

                    <td align="left" bgcolor="#ffffff"
                        style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">

                        <hr />
                        <div
                            style="display: flex; flex-flow: row; gap: 20px; justify-content: space-between; padding: 1rem 0;">
                            <img src="https://res.cloudinary.com/thebrick-realty/image/upload/v1648926886/thebrick.com.ng/email/verified-listing_lcdvko.jpg"
                                alt="verified-hostel" width="100" style="display: block; width: 250px" />
                            <div style="margin: 0;">
                                <h1 style="line-height: 48px;">What you see is what you rent</h1>
                                <p>We personally verify the places creating honest photographs, videos and descriptions
                                    for
                                    you to make safe decisions.</p>
                            </div>
                        </div>
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td align="left" bgcolor="#ffffff"
                        style="padding: 15px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">

                        <div style="margin: 0;">
                            <h1>Put your mind to rest</h1>
                            <div
                                style="display: flex; flex-flow: row; justify-content: space-between; align-items: center; gap: 50px;">
                                <img src="https://res.cloudinary.com/thebrick-realty/image/upload/v1648926880/thebrick.com.ng/email/secure_nm1iyv.png"
                                    width="100" height="100" style="display: block; width: 50px; height: 50px;"
                                    alt="secure-payment" />
                                <div>
                                    <h3>Secure payments</h3>
                                    <p>Our platform is completely safe and the hostel payment will be only transferred
                                        to the landlord after you’ve moved in. </p>
                                </div>
                            </div>
                            <div
                                style="display: flex; flex-flow: row; justify-content: space-between; align-items: center; gap: 50px;">
                                <img src="https://res.cloudinary.com/thebrick-realty/image/upload/v1648926869/thebrick.com.ng/email/clock_lect5d.png"
                                    width="100" height="100" style="display: block; width: 50px; height: 50px;"
                                    alt="secure-payment" />
                                <div>
                                    <h3>Cancelation protection</h3>
                                    <p>If the landlord cancels the last minute, we will relocate you or refund you the
                                        100% of your payment. </p>
                                </div>
                            </div>
                            <div
                                style="display: flex; flex-flow: row; justify-content: space-between; align-items: center; gap: 50px;">
                                <img src="https://res.cloudinary.com/thebrick-realty/image/upload/v1648926878/thebrick.com.ng/email/veracity_fpoc8m.png"
                                    width="100" height="100" style="display: block; width: 50px; height: 50px;"
                                    alt="secure-payment" />
                                <div>
                                    <h3>Veracity Guarantee</h3>
                                    <p>If the place is significantly different to what the listing promises, let us know
                                        within 24 hours and we’ll solve it.</p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </td>
        </tr>
        <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                    <tr>
                        <td align="center" bgcolor="#e9ecef"
                            style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">

                            <p style="margin: 0;">&copy; <span id="year"></span> Thebrick. All Rights Reserved.</p>
                            <p style="margin: 0;"><a href="https://thebrick.com.ng/about" target="_blank">About Us</a> ●
                                <a href="https://thebrick.com.ng/contact" target="_blank">Contact Us</a> ●
                                <a href="https://thebrick.com.ng/privacy-policy" target="_blank">Privacy Policy</a>
                            </p>
                            <p style="margin: 0;">Ojo, Lagos State</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
  `;
  if (role === 'investor') {
    await sendEmail({
      from: `Lemox Team <thebrickng@gmail.com>`,
      to: email,
      subject: 'Welcome to Lemox!',
      text: welcomeMsg,
    });
  }

  const uniqueId = shortid.generate();
  const result = await User.create({
    ...req.body,
    referralCode: uniqueId
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
    throw new NotFoundError(`${email} is not found in our db`);
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  const resetUrl = `http://localhost:3000/login/reset-password/${resetToken}`;

  // message that will be sent to the user when resetting password
  const message = `
  <html lang="en">



<body style="font-size: 16px; color: #000000;">
    <div>
        <img src="https://res.cloudinary.com/thebrick-realty/image/upload/v1643146881/thebrick.com.ng/thebrick_sy7yab.png" alt="logo" width="70%"
             />
        <div style="padding: 50px 25px">
            <h3>
                Someone (hopefully you) has requested a password reset for your
                account on Thebrick.
            </h3>
            <p>
                To reset your password, click the button/link below. <br />
                the link will self-destruct after 10 minutes.
            </p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>
                If you don't wish to reset your password, disregard this email and no
                action will be taken.
            </p>
            <p></p>
            <br />
            <p></p>
            <br />
            Love,
            <p>Thebrick Team</p>
            <a href="https://thebrick.com.ng/" target="_blank">
                https://thebrick.com.ng
            </a>
        </div>
    </div>
</body>

</html>
  `;

  try {
    await sendEmail({
      from: `Thebrick Support <support@thebrick.com.ng>`,
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

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  editProfile,
};
