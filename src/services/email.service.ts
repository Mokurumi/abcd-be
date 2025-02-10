import nodemailer from "nodemailer";
import config from "../config";
import logger from "../config/logger";
import { IUser } from "../types";

const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== "prod") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() => logger.warn("Unable to connect to email server."));
}

/**
 * email template
 * @param {Object} user
 * @param {string} message
 * @returns {string}
 */
const emailTemplate = (
  user: IUser | { firstName: string; emailAddress?: string },
  message: string
): string => {
  return `
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
            <h4 style="font-size: 24px; margin-bottom: 20px;">Hello ${
              user.firstName
            },</h4>
            ${message}
            <p style="font-size: 16px;">Sincerely,</p>
            <p style="font-size: 14px; font-weight: bold;">Support Team</p>
            <p style="font-size: 14px; font-weight: bold;">© ${new Date().getFullYear()} ABCD</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;
};

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (
  to: string,
  subject: string,
  text: string | null,
  html: string
) => {
  await transport.sendMail({
    from: `${"ABCD"} <${config.email.from}>`,
    to,
    subject,
    text: text || "",
    html,
  });
};

/**
 * Send registration email => One time during registration
 * @param {string} user
 * @param {string} token
 * @returns {Promise}
 */
const sendRegistrationEmail = async (user: IUser, token: string) => {
  const subject = "Welcome to ABCD";
  const url = config.web_url[config.env];
  const activationlUrl = `${url}/auth/activate?token=${token}&id=${user._id}`;
  const message = `
    <p style="font-size: 16px;">Congratulations!!</p>
    <p style="font-size: 16px;">Welcome to ABCD</p>
    <p style="font-size: 16px; margin-bottom: 20px;">Please activate and set up your account credentials by clicking on the link below.</p>
    <p style="font-size: 16px; margin-bottom: 30px;">
      <a href="${activationlUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
        Activate account
      </a>
    </p>
  `;

  const html = emailTemplate(user, message);
  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send create user email => One time during registration
 * @param {string} user
 * @param {string} token
 * @param {string} tempPassword
 * @returns {Promise}
 */
const sendCreateUserEmail = async (
  user: IUser,
  token: string,
  tempPassword: string
) => {
  const subject = "Welcome to ABCD";
  const url = config.web_url[config.env];
  const activationlUrl = `${url}/auth/activate?token=${token}&id=${user._id}`;
  const message = `
    <p style="font-size: 16px;">Congratulations!!</p>
    <p style="font-size: 16px;">Welcome to ABCD</p>
    <p style="font-size: 16px; margin-bottom: 20px;">Please activate and set up your account credentials by clicking on the link below.</p>
    <p style="font-size: 16px; margin-bottom: 30px;">
      <a href="${activationlUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
        Activate account
      </a>
    </p>
    <p style="font-size: 16px; margin-bottom: 30px;">Your temporary password is "<b>${tempPassword}</b>"</p>
    <p style="font-size: 16px; margin-bottom: 30px;">Please change your password after logging in.</p>
  `;

  const html = emailTemplate(user, message);
  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send temporary password email
 * @param {string} user
 * @param {string} tempPassword
 * @returns {Promise}
 */
const sendTemporaryPasswordEmail = async (
  user: IUser,
  tempPassword: string
) => {
  const subject = "Temporary password";
  const message = `
    <p style="font-size: 16px;">Your temporary password is "<b>${tempPassword}</b>"</p>
    <p style="font-size: 16px;">Please change your password after logging in.</p>
    <p style="font-size: 16px; margin-bottom: 30px;">If you did not request any password recovery, then ignore this email.</p>
  `;

  const html = emailTemplate(user, message);
  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send OTP CODE email
 * @param {string} user
 * @param {string} otpCode
 * @returns {Promise}
 */
const sendOTPCodeEmail = async (user: IUser, otpCode: string) => {
  const subject = "One time password";
  const message = `
    <p style="font-size: 16px;">Your verification code is <b>${otpCode}</b></p>
    <p style="font-size: 16px;">Please do not share this code with anyone.</p>
    <p style="font-size: 16px; margin-bottom: 30px;">ABCD will never ask you for this code at anytime. Be careful.</p>
  `;

  const html = emailTemplate(user, message);
  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (user: IUser, token: string) => {
  const subject = "Email Verification";
  const url = config.web_url[config.env];
  const verificationEmailUrl = `${url}/auth/verify-email?token=${token}`;
  const message = `
    <p style="font-size: 16px;">Please verify your email address by clicking on the link below.</p>
    <p style="font-size: 16px; margin-bottom: 30px;">
      <a href="${verificationEmailUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
        Verify email
      </a>
    </p>
    <p style="font-size: 16px; margin-bottom: 30px;">If you did not create an account, then ignore this email.</p>
  `;

  const html = emailTemplate(user, message);
  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send custom email to a user
 * @param {object} user
 * @param {object} subject
 * @param {object} message
 */
const sendCustomEmail = async (
  user: IUser,
  subject: string,
  message: string
) => {
  const html = emailTemplate(user, message);
  await sendEmail(user.emailAddress, subject, null, html);
};

/**
 * Send mass email to a user
 * @param {object} to
 * @param {object} subject
 * @param {object} message
 */
const sendMassEmail = async (to: string, subject: string, message: string) => {
  const html = emailTemplate(
    { firstName: to },
    `<p style="font-size: 16px; margin-bottom: 40px;">${message}</p>`
  );
  await sendEmail(to, subject, null, html);
};

/**
 * Send OTP CODE email
 * @param {string} user
 * @param {string} deleteProfileToken
 * @returns {Promise}
 */
const sendDeleteProfileEmail = async (
  user: IUser,
  deleteProfileToken: string
) => {
  const subject = "Profile Deletion";
  const url = config.web_url[config.env];
  const deleteProfileUrl = `${url}/auth/delete-profile?token=${deleteProfileToken}&id=${user._id}`;
  const message = `
    <p style="font-size: 16px;">We are sorry to see you go.</p>
    <p style="font-size: 16px;">If you wish to delete your profile, please click on the link below.</p>
    <p style="font-size: 16px; margin-bottom: 30px;">
      <a href="${deleteProfileUrl}" style="text-decoration: none; color: white; font-weight: bold; text-align: center; display: inline-block; background-color: #193E3F; padding: 8px 16px;" target="_blank">
        Delete profile
      </a>
    </p>
    <p style="font-size: 16px; margin-bottom: 30px;">If you did not request to delete your profile, then ignore this email.</p>
  `;

  const html = emailTemplate(user, message);
  await sendEmail(user.emailAddress, subject, null, html);
};

export default {
  sendRegistrationEmail,
  sendCreateUserEmail,
  sendTemporaryPasswordEmail,
  sendVerificationEmail,
  sendOTPCodeEmail,
  sendCustomEmail,
  sendMassEmail,
  sendDeleteProfileEmail,
};
