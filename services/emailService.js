const nodemailer = require('nodemailer');

exports.sendResetPasswordEmail = async (email, name, link) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Hello ${name},</p>
      <p>You requested a password reset. Click below to reset it:</p>
      <a href="${link}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
};



exports.sendWelcomeEmail = async (email, name, password, role) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Welcome to IT Asset Management System',
    html: `
      <p>Hi ${name},</p>
      <p>Your account has been created successfully. Here are your login credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Role:</strong> ${role}</li>
      </ul>
      <p>Please log in and change your password after first login.</p>
    `
  });
};
