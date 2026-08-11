const nodemailer = require('nodemailer');
const config = require('../../config');
const logger = require('../../utils/logger');

// In development, if no SMTP host is configured, emails are captured
// via nodemailer's JSON transport and logged to the console instead
// of actually being sent — lets you test the full flow with zero
// email-provider setup.
const createTransporter = () => {
  if (!config.email.host) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: config.email.user ? { user: config.email.user, pass: config.email.pass } : undefined,
  });
};

const transporter = createTransporter();

const sendMail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
    text,
  });

  if (!config.email.host) {
    logger.info(`[EMAIL - DEV MODE] Would send to ${to}. Content:`, JSON.parse(info.message));
  }

  return info;
};

module.exports = { sendMail };