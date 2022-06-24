const nodemailer = require('nodemailer');
const rateLimit = require('rate-limiter');

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // hostname
    port: 587, // port for secure SMTP - TLS
    debug: true,
    tls: {
      ciphers: 'SSLv3',
    },
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
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
