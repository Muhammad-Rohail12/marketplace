const config = require('../../config');

const wrap = (title, bodyHtml, appName) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
    <h2 style="color:#2249e0;">${appName}</h2>
    <h3>${title}</h3>
    ${bodyHtml}
    <p style="font-size: 12px; color: #999;">— The ${appName} Team</p>
  </div>
`;

const submittedEmail = ({ businessName }) => {
  const appName = config.app.name;
  return {
    subject: `Your seller application has been submitted`,
    text: `Hi,\n\nYour application for "${businessName}" has been submitted and is awaiting review. We'll email you once a decision has been made.\n\n— The ${appName} Team`,
    html: wrap(
      'Application Submitted',
      `<p>Your application for <strong>${businessName}</strong> has been submitted and is awaiting review.</p>`,
      appName
    ),
  };
};

const approvedEmail = ({ businessName }) => {
  const appName = config.app.name;
  return {
    subject: `Your seller application was approved 🎉`,
    text: `Hi,\n\nGreat news — your application for "${businessName}" has been approved! You now have seller access.\n\n— The ${appName} Team`,
    html: wrap(
      'Application Approved',
      `<p>Great news — your application for <strong>${businessName}</strong> has been approved! You now have seller access.</p>`,
      appName
    ),
  };
};

const rejectedEmail = ({ businessName, rejectionReason }) => {
  const appName = config.app.name;
  return {
    subject: `Update on your seller application`,
    text: `Hi,\n\nYour application for "${businessName}" was not approved.\n\nReason: ${rejectionReason}\n\n— The ${appName} Team`,
    html: wrap(
      'Application Update',
      `<p>Your application for <strong>${businessName}</strong> was not approved.</p><p><strong>Reason:</strong> ${rejectionReason}</p>`,
      appName
    ),
  };
};

module.exports = { submittedEmail, approvedEmail, rejectedEmail };