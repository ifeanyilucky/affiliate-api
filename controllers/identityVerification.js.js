const Identity = require('../models/identityVerification.js');
const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/bad-request.js');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');

const verifyIdentity = async (req, res) => {
  const { email, firstName, lastName, country, state, zipCode } = req.body;
  const identity = await Identity.create({
    ...req.body,
    user: req.user.userId,
  });
  const verificationRequestMsg = `
  <div>
  <h4>
  ${firstName} wants to verify their identity on Lemox
  </h4>
  <p>
  to view and verify their identity, click on the link below
  </p>
  <p>
  <a href="http://lemox.co/admin/users/${req.user.userId}" target="_blank">
  http://lemox.co/admin/users/${req.user.userId}</a>
  </p>
  </div>
  `;
  await sendEmail({
    from: `<support@lemox.com>`,
    to: 'support@lemox.co',
    subject: `${firstName} ${lastName} wants to verify identity`,
    text: verificationRequestMsg,
  });
  res.status(StatusCodes.CREATED).json(identity);
};

const updateVerification = async (req, res) => {
  const id = req.params;
  const { email } = req.user;
  const { firstName, lastName, zipCode, state, country } = req.body;
  const identity = await Identity.findByIdAndUpdate(
    mongoose.Types.ObjectId(id),
    req.body,
    {
      new: true,
    }
  );
  if (!identity) {
    throw new BadRequestError('Identity not found');
  }

  const successVerification = `
  <!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>You have been verified by Lemox</title>
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
        You have been verified by Lemox!
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
                                You're all set!</h1>

                            <p style="font-family: 'DM Sans', sans-serif; margin: 0;">
                                You have been verified by Lemox</p>
                            <p style="font-family: 'DM Sans', sans-serif;">

                                We have successfully verified your identity, now you can start building your portfolio
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
  await sendEmail({
    from: `Lemox Team <support@lemox.co>`,
    to: email,
    subject: 'We have successfully verified your identity!',
    text: successVerification,
  });
  res.status(StatusCodes.OK).json(identity);
};

const getAllIdentity = async (req, res) => {
  const identity = await Identity.find();
  res.status(StatusCodes.OK).json(identity);
};

const getSingleIdentity = async (req, res) => {
  const { id } = req.params;
  const identity = await Identity.findById(id);
  res.status(StatusCodes.OK).json(identity);
};

module.exports = {
  verifyIdentity,
  getAllIdentity,
  getSingleIdentity,
  updateVerification,
};
