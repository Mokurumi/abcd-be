const generateOTP = (charNumber = 4) => {
  let otp = "";
  for (let i = 0; i < charNumber; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const generateTempPassword = (charNumber = 8) => {
  let lowerChars = "abcdefghjkmnpqrstuvwxyz"; // removed i, l, o to avoid confusion
  let upperChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // removed I, O, and l to avoid confusion
  let numbers = "23456789"; // removed 0, 1, and l to avoid confusion
  let specialChars = "!@#$%&*_+~`?><,./-=";

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
  ans = ans.split("").sort(() => Math.random() - 0.5).join("");

  return ans;
};

module.exports = {
  generateTempPassword,
  generateOTP,
};
