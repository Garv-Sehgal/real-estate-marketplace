'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logging in user:', formData);
        router.push('/verify');
    };

    const handleGoogleSignIn = () => {
        console.log('Sign in with Google clicked');
    };

    return (
        <div className="min-h-screen flex bg-white">

            {/* LEFT SIDE – LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 bg-[url('/images/subtle-pattern.png')]">
                <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">

                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to continue to Elite Estates
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 ml-1">
                                    Email or Mobile Number
                                </label>
                                <input
                                    name="email"
                                    type="text"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter email or phone"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="••••••••"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:scale-[1.02] transition"
                        >
                            Sign In
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

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex justify-center items-center py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50"
                    >
                        Sign in with Google
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <Link href="/register" className="text-blue-600 font-medium">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE – HERO IMAGE */}
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
