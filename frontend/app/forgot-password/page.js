'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountrySelector from '../../components/CountrySelector';
import countryCodes from '../../utils/countryCodes';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [isSending, setIsSending] = useState(false);

    const isPhone = /^[0-9+]/.test(identifier);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSending(true);

        let finalIdentifier = identifier;
        if (isPhone) {
            const cleanNumber = identifier.replace(/\D/g, '');
            const cleanCountryCode = countryCode.replace('+', '');
            finalIdentifier = `+${cleanCountryCode}${cleanNumber}`;
        }

        // Simulate API call
        setTimeout(() => {
            setIsSending(false);
            console.log('Sending OTP to:', finalIdentifier);
            router.push('/verify-reset');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="/images/forgot-password-hero.png"
                    alt="Luxury Home at Sunset"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">
                        Forgot Your Password?
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md font-light leading-relaxed">
                        Reclaim your access to Elite Estates and continue your journey to finding the perfect property.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636a1.003 1.003 0 01-.464-.263L8.882 7.17A2 2 0 000 2 2h3a2 2 0 002-2v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-3a2 2 0 00-2 2v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your email or mobile number to receive an OTP.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 ml-1">
                                Email Address or Mobile Number
                            </label>

                            <div className="relative mt-1 rounded-xl shadow-sm flex items-center border border-gray-300 focus-within:border-blue-600 bg-white h-[50px] transition-colors duration-200">

                                {/* Country Code Dropdown - Conditionally Rendered */}
                                {isPhone && (
                                    <div className="relative h-full flex items-center bg-gray-50 border-r border-gray-200 rounded-l-xl">
                                        <CountrySelector
                                            value={countryCode}
                                            onChange={setCountryCode}
                                            countryCodes={countryCodes}
                                        />
                                    </div>
                                )}

                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className={`block w-full h-full px-4 border-none text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-base bg-transparent ${isPhone ? 'rounded-r-xl' : 'rounded-xl'}`}
                                    placeholder="Enter email or phone"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!identifier || isSending}
                            className={`
                                w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 transform
                                ${!identifier || isSending
                                    ? 'bg-blue-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:scale-[1.02] shadow-blue-500/30'}
                            `}
                        >
                            {isSending ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 group"
                        >
                            <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
