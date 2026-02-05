'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('buyer'); // 'buyer' (Buyer/Tenant) or 'agent' (Agent/Landlord)

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registering user:', { ...formData, role });
        // Simulate registration success and redirect
        router.push('/verify');
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Start your journey with Elite Estates
                        </p>
                    </div>

                    {/* Role Selection Switch */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setRole('buyer')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'buyer'
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Buyer / Tenant
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('agent')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'agent'
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Agent / Landlord
                        </button>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 ml-1">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 ml-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 ml-1">
                                    Mobile Number
                                </label>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    required
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 ml-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition duration-200"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* 'Remember Me' removed from here */}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/80 backdrop-blur-lg text-gray-500">
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
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.36-1.09-.56-2.13-.48-3.08.48.97 4.51 6.01 5.48 7.21.72-.08-.02-.12-.04-.15-.06-.3-.22-.61-.41-.9-.63v-.02-.85c.01.01.01.01.01 0zM12.03 2.52c-.85 1.13-2.01 1.77-3.06 1.72-.05-1.09.43-2.31 1.45-3.14.93-.76 2.22-1.36 3.07-1.12.1.02.21.05.3.09-.34.52-.75.99-1.33 1.25-.15-.22-.32-.47-.43-.8zm5.75 5.56c-1.63 1.34-1.28 3.82 1.63 5.06-.36.98-.82 1.93-1.42 2.82-.67 1.01-1.37 2.01-2.48 2.03-1.07.02-1.42-.64-2.63-.64-1.23 0-1.61.62-2.63.66-1.07.03-1.89-1.08-2.58-2.08-1.4-2.04-2.47-5.77-1.03-8.27.71-1.24 1.98-2.03 3.37-2.05 1.05-.03 2.04.71 2.68.71.64 0 1.83-.87 3.09-.75.52.02 2 .21 2.94 1.58-2.47 1.48-2.07 4.14-2.07 4.14z" />
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
