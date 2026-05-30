export function getPasswordValidation(password) {
    return {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
}

export function isPasswordValid(password) {
    const rules = getPasswordValidation(password);
    return Object.values(rules).every(Boolean);
}