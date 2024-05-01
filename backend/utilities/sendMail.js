const nodemailer = require("nodemailer");
const config = require("config");

const SMTP_HOST = config.get("SMTP_HOST");
const SMTP_PORT = config.get("SMTP_PORT");
const SMTP_SERVICE = config.get("SMTP_SERVICE");
const SMTP_MAIL = config.get("SMTP_MAIL");
const SMTP_PASSWORD = config.get("SMTP_PASSWORD");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendMail;
