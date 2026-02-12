'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function VerifyResetPage() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            console.log('Reset OTP Verified:', otp.join(''));
            router.push('/reset-password');
        }, 2000);
    };

    const handleResend = () => {
        setTimer(30);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="/images/verify-reset-hero.png"
                    alt="Modern Interior"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">
                        Secure Your Account
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md font-light leading-relaxed">
                        One Step Closer to SPRxElite Estates. Verify your identity to reset your password.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Enter Verification Code
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We've sent a 6-digit code to your email/mobile.
                        </p>
                    </div>

                    <div className="mt-8 space-y-8">
                        <div className="flex justify-center gap-1 sm:gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={otp.some((d) => !d) || isVerifying}
                            className={`
                                w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 transform
                                ${otp.some((d) => !d) || isVerifying
                                    ? 'bg-blue-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:scale-[1.02] shadow-blue-500/30'}
                            `}
                        >
                            {isVerifying ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{' '}
                                {timer > 0 ? (
                                    <span className="font-medium text-gray-500">Resend in {timer}s</span>
                                ) : (
                                    <button
                                        onClick={handleResend}
                                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
