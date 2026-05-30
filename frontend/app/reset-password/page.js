'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { setNewPassword } from "../../lib/passwordReset";
import { getPasswordValidation, isPasswordValid } from "../../utils/passwordRules";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPasswordFocused, setNewPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    
    useEffect(() => {
    const token = localStorage.getItem("resetToken");
    if (!token) {
        router.replace("/forgot-password");
    }
}, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && passwords.newPassword && passwords.confirmPassword && !isSubmitting) {
            handleSubmit(e);
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
        setStatus({ type: 'error', message: "Passwords don't match" });
        return;
    }

    if (!isPasswordValid(passwords.newPassword)) {
        setStatus({
            type: 'error',
            message: 'Password does not meet required rules'
        });
        return;
    }
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
        const resetToken = localStorage.getItem("resetToken");

        if (!resetToken) {
            throw new Error("Reset session expired. Please restart the process.");
        }

        await setNewPassword(resetToken, passwords.newPassword);

        // cleanup
        localStorage.removeItem("resetToken");
        localStorage.removeItem("resetIdentifier");

        setStatus({ type: 'success', message: 'Password updated successfully' });

        setTimeout(() => {
            router.push('/login');
        }, 1500);

    } catch (error) {
        setStatus({ type: 'error', message: error.message || "Failed to reset password" });
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="/images/reset-password-hero.png"
                    alt="City Skyline"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">
                        Set Your New Password
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md font-light leading-relaxed">
                        Ready to Explore Elite Estates? Secure your account with a strong new password.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            New Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a strong, unique password for your account.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 ml-1">
                                    New Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        required
                                        value={passwords.newPassword}
                                        onChange={handleChange}
                                        onFocus={() => setNewPasswordFocused(true)}
                                        onBlur={() => setNewPasswordFocused(false)}
                                        onKeyDown={handleKeyDown}
                                        className="block w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                                        placeholder="Enter your new password"
                                    />
                                    {(newPasswordFocused || passwords.newPassword) && (
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showNewPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className="text-xs mt-2 space-y-1">
                                {Object.entries(getPasswordValidation(passwords.newPassword)).map(([rule, passed]) => (
                                    <div key={rule} className={passed ? "text-green-600" : "text-gray-400"}>
                                        {rule === "length" && "• At least 8 characters"}
                                        {rule === "uppercase" && "• One uppercase letter"}
                                        {rule === "lowercase" && "• One lowercase letter"}
                                        {rule === "number" && "• One number"}
                                        {rule === "special" && "• One special character"}
                                    </div>
                                ))}
                            </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 ml-1">
                                    Confirm New Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={passwords.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setConfirmPasswordFocused(true)}
                                        onBlur={() => setConfirmPasswordFocused(false)}
                                        onKeyDown={handleKeyDown}
                                        className="block w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
                                        placeholder="Confirm your new password"
                                    />
                                    {(confirmPasswordFocused || passwords.confirmPassword) && (
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!passwords.newPassword || !passwords.confirmPassword || isSubmitting}
                            className={`
                                w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 transform
                                ${!passwords.newPassword || !passwords.confirmPassword || isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:scale-[1.02] shadow-blue-500/30'}
                            `}
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Set New Password'
                            )}
                        </button>

                        {/* Status Message */}
                        {status.message && (
                            <div className={`text-center text-sm font-medium mt-4 ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {status.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}