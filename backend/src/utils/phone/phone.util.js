const { parsePhoneNumberFromString } = require('libphonenumber-js');

const normalizePhone = (phone) => {

    const parsed = parsePhoneNumberFromString(phone, 'IN');

    if (!parsed || !parsed.isValid()) {
        throw new Error('Invalid phone number');
    }

    return parsed.number;
};

module.exports = {
    normalizePhone
};
