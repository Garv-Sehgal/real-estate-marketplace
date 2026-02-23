'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { setNewPassword } from "../../lib/passwordReset";
import { validatePassword } from "../../utils/passwordRules";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    
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

const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

        const passwordError = validatePassword(passwords.newPassword);
    if (passwordError) {
        alert(passwordError);
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
                        Ready to Explore SPRxElite Estates? Secure your account with a strong new password.
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
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
                                    
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 ml-1">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
                                    
                                />
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
