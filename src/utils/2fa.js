const qrcode = require('qrcode');
const otplib = require('otplib');

const { authenticator } = otplib;

/** Tạo mã OTP token */
const generateOTPToken = (username, serviceName, secret) => {
    return authenticator.keyuri(username, serviceName, secret);
};

const generateUniqueSecret = () => {
    return authenticator.generateSecret();
};

/** Kiểm tra mã OTP token có hợp lệ hay không
 * Có 2 method "verify" hoặc "check", các bạn có thể thử dùng một trong 2 tùy thích.
 */
const verifyOTPToken = (token, secret) => {
    return authenticator.verify({ token, secret });
};

/** Tạo QR code từ mã OTP để gửi về cho user sử dụng app quét mã */
const generateQRCode = async (otpAuth) => {
    try {
        const QRCodeImageUrl = await qrcode.toDataURL(otpAuth);
        return `<img src='${QRCodeImageUrl}' alt='qr-code-img' />`;
    } catch (error) {
        console.log('Could not generate QR code', error);
        return;
    }
};

module.exports = {
    generateOTPToken,
    generateUniqueSecret,
    verifyOTPToken,
    generateQRCode,
};
