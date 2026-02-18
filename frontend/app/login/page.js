'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountrySelector from '../../components/CountrySelector';
import { loginUser } from '../../lib/auth';

import countryCodes from '../../utils/countryCodes';

export default function LoginPage() {
    const router = useRouter();

    const [countryCode, setCountryCode] = useState('+91');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const isPhone = /^[0-9+]/.test(formData.email);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let identifier = formData.email;

            // Convert phone to E.164
            if (isPhone) {
                const cleanNumber = formData.email.replace(/\D/g, '');
                const cleanCountryCode = countryCode.replace('+', '');
                identifier = `+${cleanCountryCode}${cleanNumber}`;
            }

            const user = await loginUser(identifier, formData.password);

            // Role-based redirect
            if (user.role === 'super_admin') router.push('/dashboard/super-admin');
            else if (user.role === 'admin') router.push('/dashboard/admin');
            else if (user.role === 'agent') router.push('/dashboard/agent');
            else if (user.role === 'landlord') router.push('/dashboard/landlord');
            else router.push('/');

        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        console.log('Sign in with Google clicked');
    };

    return (
        <div className="min-h-screen flex bg-white">

            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">

                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Sign in to continue to SPRxElite Estates
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">

                            {/* Email / Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 ml-1">
                                    Email or Mobile Number
                                </label>

                                <div className="relative mt-1 rounded-xl shadow-sm flex items-center border border-gray-300 focus-within:border-blue-600 bg-white h-[50px] transition-colors duration-200">

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
                                        name="email"
                                        type="text"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`block w-full h-full px-4 border-none text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-base bg-transparent ${isPhone ? 'rounded-r-xl' : 'rounded-xl'}`}
                                        placeholder="Enter email or phone"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 ml-1">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="••••••••"
                                />

                                <div className="flex justify-between items-center mt-3">
                                    <div className="flex items-center">
                                        <input
                                            id="rememberMe"
                                            name="rememberMe"
                                            type="checkbox"
                                            checked={formData.rememberMe}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:scale-[1.02] transition disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        {error && (
                            <p className="text-red-500 text-center text-sm mt-2">
                                {error}
                            </p>
                        )}
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <Link href="/register" className="text-blue-600 font-medium">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden lg:flex w-1/2 relative">
                <Image
                    src="/images/login-hero.png"
                    alt="Luxury Interior"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4">
                        Premium Living <br />
                        <span className="text-blue-400">Redefined</span>
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md">
                        Login to access exclusive properties and personalized recommendations.
                    </p>
                </div>
            </div>

        </div>
    );
}
