const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== "prod") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() => logger.warn("Unable to connect to email server."));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = {
    from: `${"ABCD Think Tank"} <${config.email.from}>`,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};

/**
 * Send registration email => One time during registration
 * @param {string} user
 * @param {string} token
 * @returns {Promise}
 */
const sendRegistrationEmail = async (user, token) => {
  const subject = "Welcome to ABCD Think Tank";
  const url = config.web_url[config.env];
  const activationlUrl = `${url}/activate?token=${token}&id=${user._id}`;
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${user.firstName},</h4>
            <p style="font-size: 16px;">Congratulations!!</p>
            <p style="font-size: 16px;">Welcome to ABCD Think Tank</p>
            <p style="font-size: 16px; margin-bottom: 20px;">Please activate and set up your account credentials by clicking on the link below.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              <a href="${activationlUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
                Activate account
              </a>
            </p>
            <p style="font-size: 14px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send create user email => One time during registration
 * @param {string} user
 * @param {string} token
 * @param {string} tempPassword
 * @returns {Promise}
 */
const sendCreateUserEmail = async (user, token, tempPassword) => {
  const subject = "Welcome to ABCD Think Tank";
  const url = config.web_url[config.env];
  const activationlUrl = `${url}/activate?token=${token}&id=${user._id}`;
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${user.firstName},</h4>
            <p style="font-size: 16px;">Congratulations!!</p>
            <p style="font-size: 16px;">Welcome to ABCD Think Tank</p>
            <p style="font-size: 16px; margin-bottom: 20px;">Please activate and set up your account credentials by clicking on the link below.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              <a href="${activationlUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
                Activate account
              </a>
            </p>
            <p style="font-size: 16px; margin-bottom: 30px;">Your temporary password is <b>${tempPassword}</b></p>
            <p style="font-size: 16px; margin-bottom: 30px;">Please change your password after logging in.</p>
            <p style="font-size: 14px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (user, token) => {
  const subject = "Reset password";
  const url = config.web_url[config.env];
  const resetPasswordUrl = `${url}/reset-password?token=${token}&id=${user._id}`;

  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${user.firstName},</h4>
            <p style="font-size: 16px; margin-bottom: 20px;">Please reset your account password by clicking on the link below.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              <a href="${resetPasswordUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
                Reset password
              </a>
            </p>
            <p style="font-size: 16px; margin-bottom: 30px;">If you did not request any password recovery, then ignore this email.</p>
            <p style="font-size: 14px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send temporary password email
 * @param {string} user
 * @param {string} tempPassword
  * @returns {Promise}
  */
const sendTemporaryPasswordEmail = async (user, tempPassword) => {
  const subject = "Temporary password";
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${user.firstName},</h4>
            <p style="font-size: 16px;">Your temporary password is <b>${tempPassword}</b></p>
            <p style="font-size: 16px;">Please change your password after logging in.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">If you did not request any password recovery, then ignore this email.</p>
            <p style="font-size: 14px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send OTP CODE email
 * @param {string} user
 * @param {string} otpCode
 * @returns {Promise}
 */
const sendOTPCodeEmail = async (user, otpCode) => {
  const subject = "One time password";
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${user.firstName},</h4>
            <p style="font-size: 16px;">Your verification code is <b>${otpCode}</b></p>
            <p style="font-size: 16px;">Please do not share this code with anyone.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">ABCD Think Tank will never ask you for this code at anytime. Be careful.</p>
            <p style="font-size: 14px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (user, token) => {
  const subject = "Email Verification";
  const url = config.web_url[config.env];
  const verificationEmailUrl = `${url}/verify-email?token=${token}`;
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${user.firstName},</h4>
            <p style="font-size: 16px; margin-bottom: 20px;">Please verify your email address by clicking on the link below.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              <a href="${verificationEmailUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
                Activate account
              </a>
            </p>
            <p style="font-size: 16px; margin-bottom: 30px;">If you did not create an account, then ignore this email.</p>
            <p style="font-size: 14px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send custom email to a user
 * @param {object} user
 * @param {object} subject
 * @param {object} message
 */
const sendCustomEmail = async (user, subject, message) => {
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hey ${user.firstName},</h4>
            <p style="font-size: 16px; font-weight: bold;">${subject}</p>
            <p style="font-size: 16px; margin-bottom: 40px;">${message}</p>
            <p style="font-size: 16px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send mass email to a user
 * @param {object} to
 * @param {object} subject
 * @param {object} message
 */
const sendMassEmail = async (to, subject, message) => {
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hey there,</h4>
            <p style="font-size: 16px; font-weight: bold;">${subject}</p>
            <p style="font-size: 16px; margin-bottom: 40px;">${message}</p>
            <p style="font-size: 16px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(to, subject, null, html);
};

/**
 * Send OTP CODE email
 * @param {string} user
 * @returns {Promise}
 */
const sendDeleteProfileEmail = async (user, deleteProfileToken) => {
  const subject = "Profile Deletion";
  const url = config.web_url[config.env];
  const deleteProfileUrl = `${url}/delete-profile?token=${deleteProfileToken}&id=${user._id}`;
  const html = `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #495057; text-align: center; border: 2px solid #193E3F; box-sizing: border-box;">
      <tbody>
        <!-- Logo -->
        <tr>
          <td>
            <img
              src=${config.logo}
              alt="Logo"
              style="max-width: 200px; margin-top: 45px"
            >
          </td>
        </tr>

        <!-- Email Body -->
        <tr>
          <td style="padding: 20px;">
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${user.firstName},</h4>
            <p style="font-size: 16px;">We are sorry to see you go.</p>
            <p style="font-size: 16px;">If you wish to delete your profile, please click on the link below.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">
              <a href="${deleteProfileUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
                Delete profile
              </a>
            </p>
            <p style="font-size: 16px; margin-bottom: 30px;">If you did not request to delete your profile, then ignore this email.</p>
            <p style="font-size: 14px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD Think Tank</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  await sendEmail(user.emailAddress, subject, null, html);
};

module.exports = {
  transport,
  sendEmail,
  sendRegistrationEmail,
  sendCreateUserEmail,
  sendResetPasswordEmail,
  sendTemporaryPasswordEmail,
  sendVerificationEmail,
  sendOTPCodeEmail,
  sendCustomEmail,
  sendMassEmail,
  sendDeleteProfileEmail,
};
