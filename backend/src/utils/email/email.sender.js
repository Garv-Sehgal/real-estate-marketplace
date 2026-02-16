const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmailOTP = async (to, otp) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Your OTP Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Real Estate Marketplace</h2>
                <p>Your verification OTP is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendEmailOTP
};
