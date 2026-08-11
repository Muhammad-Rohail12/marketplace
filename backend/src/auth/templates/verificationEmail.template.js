const config = require('../../config');

const verificationEmailTemplate = ({ firstName, verifyUrl, expiresInHours }) => {
  const appName = config.app.name;
  const subject = `Verify your email for ${appName}`;

  const text = [
    `Hi ${firstName},`,
    '',
    `Thanks for signing up for ${appName}. Please verify your email by visiting the link below:`,
    '',
    verifyUrl,
    '',
    `This link expires in ${expiresInHours} hours. If you didn't create this account, you can safely ignore this email.`,
    '',
    `— The ${appName} Team`,
  ].join('\n');

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="color:#2249e0;">${appName}</h2>
      <p>Hi ${firstName},</p>
      <p>Thanks for signing up. Please confirm your email address to activate your account.</p>
      <p style="margin: 24px 0;">
        <a href="${verifyUrl}" style="background:#2249e0;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
          Verify Email
        </a>
      </p>
      <p style="font-size: 13px; color: #666;">This link expires in ${expiresInHours} hours.</p>
      <p style="font-size: 13px; color: #666;">If you didn't create this account, you can safely ignore this email.</p>
      <p style="font-size: 12px; color: #999;">— The ${appName} Team</p>
    </div>
  `;

  return { subject, html, text };
};

module.exports = verificationEmailTemplate;