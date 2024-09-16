const generateOTP = (charNumber = 4) => {
  let otp = "";
  for (let i = 0; i < charNumber; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

module.exports.generateOTP = generateOTP;
