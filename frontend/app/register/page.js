'use client';
console.log("REGISTER PAGE VERSION: NEW FILE");

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountrySelector from '../../components/CountrySelector';
import countryCodes from '../../utils/countryCodes';
import { requestSignupOTP } from '../../lib/auth';
import { getPasswordValidation, isPasswordValid } from '../../utils/passwordRules';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('buyer');
    const [countryCode, setCountryCode] = useState('+91');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
    });

    const passwordRules = getPasswordValidation(formData.password);
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
        alert('Please select a role');
        return;
    }

    if (!isPasswordValid(formData.password)) {
        return;
    }
    try {
        setLoading(true);

        // format phone to E.164
        const cleanNumber = formData.phone.replace(/\D/g, '');
        const cleanCountryCode = countryCode.replace('+', '');
        const phone = `+${cleanCountryCode}${cleanNumber}`;

            const res = await requestSignupOTP({
        fullName: formData.fullName,
        phone,
        email: formData.email,
        password: formData.password,
        role,
    });




    sessionStorage.setItem(
        'signupData',
        JSON.stringify({
            signupId: res.signupId,
            email: formData.email.trim().toLowerCase(),
            phone,
            role
        })
    );

        router.push('/verify');

    } catch (err) {
        alert(err.message || 'Failed to send OTP');
    } finally {
        setLoading(false);
    }
};

    const handleGoogleSignUp = () => {
        console.log('Sign up with Google clicked');
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex w-1/2 relative">
                <Image
                    src="/images/register-hero.png"
                    alt="Luxury Property"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-5xl font-bold mb-4 font-sans tracking-tight">
                        Discover Your <br />
                        <span className="text-blue-400">Dream Home</span>
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md">
                        Join thousands of users in the most premium real estate marketplace. Experience luxury like never before.
                    </p>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-5 bg-white/80 backdrop-blur-lg p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Create Account
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Start your journey with SPRxElite Estates
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                        {['buyer', 'agent', 'landlord'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                                    role === r
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                            >
                                {r === 'buyer'
                                    ? 'Buyer / Tenant'
                                    : r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>

                    <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 ml-1 mb-1">
                                    Full Name
                                </label>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 ml-1 mb-1">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 ml-1 mb-1">
                                    phone Number
                                </label>
                                <div className="relative flex items-center border border-gray-300 bg-white rounded-xl h-[46px]">
                                    <div className="relative h-full flex items-center bg-gray-50 border-r border-gray-200 rounded-l-xl">
                                        <CountrySelector
                                            value={countryCode}
                                            onChange={setCountryCode}
                                            countryCodes={countryCodes}
                                        />
                                    </div>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="block w-full h-full px-4 border-none text-sm bg-transparent"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 ml-1 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        className="block w-full px-4 py-2.5 pr-12 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none text-sm"
                                        placeholder="Enter your password"
                                    />
                                    {(passwordFocused || formData.password) && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? (
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
<<<<<<< HEAD
=======
                                {formData.password && (
                                <div className="mt-2 space-y-1 text-xs ml-1">
                                    <p className={passwordRules.minLength ? "text-green-600" : "text-gray-400"}>
                                        • At least 8 characters
                                    </p>
                                    <p className={passwordRules.hasUppercase ? "text-green-600" : "text-gray-400"}>
                                        • One uppercase letter
                                    </p>
                                    <p className={passwordRules.hasLowercase ? "text-green-600" : "text-gray-400"}>
                                        • One lowercase letter
                                    </p>
                                    <p className={passwordRules.hasNumber ? "text-green-600" : "text-gray-400"}>
                                        • One number
                                    </p>
                                    <p className={passwordRules.hasSpecial ? "text-green-600" : "text-gray-400"}>
                                        • One special character
                                    </p>
                                </div>
                            )}
>>>>>>> origin/feature/frontend-integration
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:scale-[1.02] transition"
                        >
                            {loading ? 'Sending OTP...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/80 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        {/* Google */}
                        <button
                            onClick={handleGoogleSignUp}
                            className="flex items-center justify-center w-14 h-14 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        </button>

                        {/* Apple */}
                        <button className="flex items-center justify-center w-14 h-14 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
                            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.96 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.99 3.915-.99 1.832 0 2.383.99 3.96.948 1.605-.06 2.747-1.63 3.766-3.15 1.15-1.745 1.636-3.41 1.66-3.52-.027-.027-3.17-1.218-3.14-4.832.06-3.036 2.503-4.495 2.624-4.596-1.425-2.074-3.64-2.296-4.41-2.356-1.24-.135-2.288-.633-3.045-.633l-.721.036zm3.79-4.734c.85-1.04 1.42-2.486 1.25-3.95-1.22.052-2.72.822-3.604 1.85-.79.907-1.474 2.37-1.29 3.824 1.35.104 2.766-.645 3.645-1.724z" />
                            </svg>
                        </button>

                        {/* Facebook */}
                        <button className="flex items-center justify-center w-14 h-14 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
                            <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
