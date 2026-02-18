'use client';
console.log("REGISTER PAGE VERSION: NEW FILE");

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountrySelector from '../../components/CountrySelector';
import countryCodes from '../../utils/countryCodes';
import { requestSignupOTP } from '../../lib/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('buyer');
    const [countryCode, setCountryCode] = useState('+91');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
    });

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
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                    placeholder="••••••••"
                                />
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
                        <button
                            onClick={handleGoogleSignUp}
                            className="flex items-center justify-center w-14 h-14 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                        >
                            G
                        </button>
                        <button className="flex items-center justify-center w-14 h-14 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                            A
                        </button>
                        <button className="flex items-center justify-center w-14 h-14 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                            F
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
