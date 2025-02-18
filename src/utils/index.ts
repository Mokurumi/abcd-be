/**
 * Generate a random OTP (One Time Password) of given length
 * @param {number} charNumber - Number of characters in the OTP
 * @returns {string} OTP
 */
const generateOTP = (charNumber: number = 4): string => {
  let otp = "";
  for (let i = 0; i < charNumber; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

/**
 * Generate a temporary password with at least one character from each character set
 * @param {number} charNumber - Number of characters in the password
 * @returns {string} Generated temporary password
 */
const generateTempPassword = (charNumber: number = 8): string => {
  const lowerChars = "abcdefghjkmnpqrstuvwxyz"; // removed i, l, o to avoid confusion
  const upperChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // removed I, O, and l to avoid confusion
  const numbers = "23456789"; // removed 0 and 1 to avoid confusion
  const specialChars = "!@#$&*_+?><,.-=";

  // Generate password with at least one character from each character set
  let ans = "";
  ans += lowerChars[Math.floor(Math.random() * lowerChars.length)];
  ans += upperChars[Math.floor(Math.random() * upperChars.length)];
  ans += numbers[Math.floor(Math.random() * numbers.length)];
  ans += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Generate the rest of the password
  for (let i = 4; i < charNumber; i++) {
    let charSet = lowerChars + upperChars + numbers + specialChars;
    ans += charSet[Math.floor(Math.random() * charSet.length)];
  }

  // Shuffle the password
  ans = ans
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return ans;
};

/**
 * Generate a unique ID with a given prefix
 * @param {string} prefix - The prefix for the unique ID
 * @returns {string} Unique ID
 */
const generateUniqueId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${suffix}`.toUpperCase();
};

/**
 * Format a phone number to start with +254 if it starts with 0
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
const formatPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber?.startsWith("0")) {
    return phoneNumber.replace(/^0/, "+254");
  }
  return phoneNumber;
};

/**
 * Extract the date part from a Date object or string
 * @param {Date | string} date - The date to extract
 * @returns {string} Extracted date in ISO format (yyyy-mm-dd)
 */
const extractDate = (date: Date | string): string => {
  return new Date(date).toISOString().split("T")[0];
};

export {
  generateTempPassword,
  generateOTP,
  generateUniqueId,
  formatPhoneNumber,
  extractDate,
};
