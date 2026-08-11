const config = require('../../config');

const passwordResetEmailTemplate = ({ firstName, resetUrl, expiresInMinutes }) => {
  const appName = config.app.name;
  const supportEmail = config.app.supportEmail;
  const subject = `Reset your ${appName} password`;

  const text = [
    `Hi ${firstName},`,
    '',
    `We received a request to reset your ${appName} password. Visit the link below to choose a new password:`,
    '',
    resetUrl,
    '',
    `This link expires in ${expiresInMinutes} minutes.`,
    '',
    `If you didn't request this, you can safely ignore this email — your password will not be changed.`,
    '',
    `Need help? Contact us at ${supportEmail}`,
    '',
    `— The ${appName} Team`,
  ].join('\n');

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="color:#2249e0;">${appName}</h2>
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your password. Click below to choose a new one.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background:#2249e0;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 13px; color: #666;">This link expires in ${expiresInMinutes} minutes.</p>
      <p style="font-size: 13px; color: #b45309; background:#fffbeb; padding: 8px 12px; border-radius: 6px;">
        If you didn't request this, you can safely ignore this email — your password will not be changed.
      </p>
      <p style="font-size: 12px; color: #999;">Need help? Contact us at ${supportEmail}</p>
      <p style="font-size: 12px; color: #999;">— The ${appName} Team</p>
    </div>
  `;

  return { subject, html, text };
};

module.exports = passwordResetEmailTemplate;