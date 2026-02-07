import { allCountries } from 'country-telephone-data';

// Process the raw data into a clean, easy-to-use format
// Raw format: objects with many fields. We need specific ones.
const countryCodes = allCountries.map((country) => ({
    name: country.name,
    iso2: country.iso2.toUpperCase(),
    dialCode: `+${country.dialCode}`,
    format: country.format || null, // Optional: phone number format mask if available
}));

export default countryCodes;
