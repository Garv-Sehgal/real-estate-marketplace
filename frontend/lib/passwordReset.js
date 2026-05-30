import { apiRequest } from "./api";

/* STEP 1 — REQUEST OTP */
export async function requestResetOTP(identifier) {
    return await apiRequest("/auth/password/request-reset-otp", {
        method: "POST",
        body: JSON.stringify({ identifier }),
    });
}

/* STEP 2 — VERIFY OTP */
export async function verifyResetOTP(identifier, otp) {
    return await apiRequest("/auth/password/verify-reset-otp", {
        method: "POST",
        body: JSON.stringify({ identifier, otp }),
    });
}

/* STEP 3 — SET NEW PASSWORD */
export async function setNewPassword(resetToken, newPassword) {
    return await apiRequest("/auth/password/set-new-password", {
        method: "POST",
        body: JSON.stringify({ resetToken, newPassword }),
    });
}