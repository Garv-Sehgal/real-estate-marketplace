'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { verifySignupOTP } from '../../lib/auth';

export default function VerifyPage() {
    const router = useRouter(); // Initialize router
    // State for Mobile OTP
    const [mobileOtp, setMobileOtp] = useState(['', '', '', '', '', '']);
    const [mobileTimer, setMobileTimer] = useState(30);
    const mobileInputRefs = useRef([]);

    // State for Email OTP
    const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
    const [emailTimer, setEmailTimer] = useState(30);
    const emailInputRefs = useRef([]);

    const [isVerifying, setIsVerifying] = useState(false);

    // Timer Logic for Mobile
    useEffect(() => {
        const interval = setInterval(() => {
            setMobileTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Timer Logic for Email
    useEffect(() => {
        const interval = setInterval(() => {
            setEmailTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Handle Mobile OTP Input
    const handleMobileChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...mobileOtp];
        newOtp[index] = value;
        setMobileOtp(newOtp);
        if (value && index < 5) mobileInputRefs.current[index + 1].focus();
    };

    const handleMobileKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !mobileOtp[index] && index > 0) {
            mobileInputRefs.current[index - 1].focus();
        }
    };

    // Handle Email OTP Input
    const handleEmailChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...emailOtp];
        newOtp[index] = value;
        setEmailOtp(newOtp);
        if (value && index < 5) emailInputRefs.current[index + 1].focus();
    };

    const handleEmailKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
            emailInputRefs.current[index - 1].focus();
        }
    };


const handleVerify = async () => {
    try {
        setIsVerifying(true);

        const stored = JSON.parse(sessionStorage.getItem('signupData'));

        if (!stored?.signupId) {
            alert("Signup session expired. Please register again.");
            router.push('/register');
            return;
        }

        await verifySignupOTP({
            signupId: stored.signupId,
            phoneOtp: mobileOtp.join(''),
            emailOtp: emailOtp.join('')
        });

        sessionStorage.removeItem('signupData');

        alert("Account created successfully!");
        router.push('/login');

    } catch (err) {
        alert(err.message || "OTP verification failed");
    } finally {
        setIsVerifying(false);
    }
};


    const handleResendMobile = () => setMobileTimer(30);
    const handleResendEmail = () => setEmailTimer(30);

    const isFormValid = mobileOtp.every(d => d) && emailOtp.every(d => d);

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="/images/login-hero.png"
                    alt="Luxury Interior"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">
                        Verify Your Identity
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md font-light leading-relaxed">
                        Secure your account and gain access to the most exclusive real estate listings.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Account Verification
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 font-medium">
                            Please enter the codes sent to your mobile and email.
                        </p>
                    </div>

                    <div className="space-y-6 sm:space-y-8 mt-8">

                        {/* Section 1: Mobile OTP */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-blue-50 rounded-full">
                                    <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">Enter Mobile OTP</h3>
                            </div>

                            <div className="flex justify-between gap-1 sm:gap-2">
                                {mobileOtp.map((digit, index) => (
                                    <input
                                        key={`mobile-${index}`}
                                        ref={(el) => (mobileInputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleMobileChange(index, e.target.value)}
                                        onKeyDown={(e) => handleMobileKeyDown(index, e)}
                                        className="w-full h-10 sm:h-12 text-center text-lg sm:text-xl font-bold text-gray-900 bg-white border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200"
                                    />
                                ))}
                            </div>

                            <div className="text-right">
                                {mobileTimer > 0 ? (
                                    <span className="text-sm text-gray-600 font-medium">Resend via SMS in <span className="text-blue-700 font-bold">{mobileTimer}s</span></span>
                                ) : (
                                    <button onClick={handleResendMobile} className="text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors">
                                        Resend Mobile OTP
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Email OTP */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-blue-50 rounded-full">
                                    <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">Enter Email OTP</h3>
                            </div>

                            <div className="flex justify-between gap-1 sm:gap-2">
                                {emailOtp.map((digit, index) => (
                                    <input
                                        key={`email-${index}`}
                                        ref={(el) => (emailInputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        onKeyDown={(e) => handleEmailKeyDown(index, e)}
                                        className="w-full h-10 sm:h-12 text-center text-lg sm:text-xl font-bold text-gray-900 bg-white border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200"
                                    />
                                ))}
                            </div>

                            <div className="text-right">
                                {emailTimer > 0 ? (
                                    <span className="text-sm text-gray-600 font-medium">Resend via Email in <span className="text-blue-700 font-bold">{emailTimer}s</span></span>
                                ) : (
                                    <button onClick={handleResendEmail} className="text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors">
                                        Resend Email OTP
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Verify Action */}
                        <div className="pt-2">
                            <button
                                onClick={handleVerify}
                                disabled={!isFormValid || isVerifying}
                                className={`
                                    w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-base font-bold text-white shadow-md transition-all duration-200 transform
                                    ${!isFormValid || isVerifying
                                        ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-blue-700 hover:bg-blue-800 hover:scale-[1.02] shadow-blue-500/30'}
                                    `}
                            >
                                {isVerifying ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Verify Identity'
                                )}
                            </button>
                        </div>

                        {/* Security Message */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-900 font-semibold leading-relaxed">
                                To ensure your account security, please enter both OTPs. <br />
                                Once verified, you will be able to log in to your account with phone or email.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
