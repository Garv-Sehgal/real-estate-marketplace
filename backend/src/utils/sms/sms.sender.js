const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendSMSOTP = async (to, otp) => {

    const message = await client.messages.create({
        body: `Your Real Estate Marketplace OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE,
        to
    });

    return message.sid;
};

module.exports = {
    sendSMSOTP
};
