const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.lemox.co',
    port: 465,
    secure: true,
    ssl: false,
ignoreTLS: false,
requireTLS: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      secureProtocol: "TLSv1_2_method",
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
    } else console.log(success);
  });
};

module.exports = sendEmail;
