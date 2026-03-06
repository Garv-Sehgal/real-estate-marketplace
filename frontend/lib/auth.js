import { apiRequest } from "./api";

/* =========================
   LOGIN
========================= */
export async function loginUser(identifier, password) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { identifier, password },   // ❌ removed stringify
    });

    saveAuthSession(data.data);
    return data.data.user;
}

/* =========================
   SIGNUP STEP 1 → REQUEST OTP
========================= */
export async function requestSignupOTP(payload) {

    const body = {
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
        role: payload.role,
    };

    const data = await apiRequest("/auth/signup/request-otp", {
        method: "POST",
        body: body,   // ❌ removed stringify
    });

    return data;
}

/* =========================
   SIGNUP STEP 2 → VERIFY OTP + CREATE ACCOUNT
========================= */
export async function verifySignupOTP(payload) {
    const data = await apiRequest("/auth/signup/verify-otp", {
        method: "POST",
        body: payload,   // ❌ removed stringify
    });

    saveAuthSession(data.data);
    return data.data.user;
}

/* =========================
   LOGOUT
========================= */
export async function logoutUser() {
    await apiRequest("/auth/logout", { method: "POST" });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
}

/* =========================
   SESSION HELPER
========================= */
function saveAuthSession(authData) {
    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("refreshToken", authData.refreshToken);
    localStorage.setItem("user", JSON.stringify(authData.user));
}