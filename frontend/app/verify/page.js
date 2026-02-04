'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
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

        // Auto focus next input
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
        // Simulate verification delay
        setTimeout(() => {
            setIsVerifying(false);
            console.log('Verified OTP:', otp.join(''));
            // Add success redirect here
        }, 2000);
    };

    const handleResend = () => {
        setTimer(30);
        // Add resend logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('/images/subtle-pattern.png')] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Verify Your Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We sent a verification code to your email/phone. <br />
                        Enter the code below to continue.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={otp.some((d) => !d) || isVerifying}
                        className={`
              w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 transform
              ${otp.some((d) => !d) || isVerifying
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:scale-[1.02] shadow-blue-500/30'}
            `}
                    >
                        {isVerifying ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Verify & Continue'
                        )}
                    </button>

                    <div className="text-center mt-4">
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
    );
}
