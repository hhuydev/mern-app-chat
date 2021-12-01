const qrcode = require('qrcode');
const otplib = require('otplib');
const speakeasy = require('speakeasy');

const { authenticator } = otplib;

/** Tạo mã OTP token */
const generateOTPToken = (username, serviceName, secret) => {
    return authenticator.keyuri(username, serviceName, secret);
};

const generateUniqueSecret = () => {
    //   return authenticator.generateSecret();
    return speakeasy.generateSecret({ length: 20 });
};

/** Kiểm tra mã OTP token có hợp lệ hay không
 *
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

const totpGenerate = (secret) => {
    const newTotp = {
        token: speakeasy.totp({ secret, encoding: 'base32' }),
        remaining: 180 - Math.floor((new Date().getTime() / 1000.0) % 30),
    };
    return newTotp;
};

const validateTotp = (secret, token) => {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 0,
    });
};

module.exports = {
    generateOTPToken,
    generateUniqueSecret,
    verifyOTPToken,
    generateQRCode,
    totpGenerate,
    validateTotp,
};
