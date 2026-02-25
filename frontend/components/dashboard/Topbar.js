"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Topbar({ setMobileOpen }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Failed to parse user data");
            }
        }
    }, []);

    const formatRole = (role) => {
        if (!role) return 'User';
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleLogout = () => {
        // Implement full logout logic via API if needed, for now just local clear
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 flex items-center justify-between px-4 lg:px-10 z-10 sticky top-0 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
            {/* Left: Mobile Menu Toggle & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 lg:hidden text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                    <Menu size={24} />
                </button>

                {/* Mobile Logo */}
                <Link href="/" className="lg:hidden flex items-center gap-2">
                    <img
                        src="/images/Elite_Estates Logo.png"
                        alt="SPRxElite Estate Logo"
                        className="h-8 w-auto object-contain"
                    />
                </Link>

                <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back,</h1>
                    <p className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                        {user?.fullName || 'Guest'} <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{formatRole(user?.role)}</span>
                    </p>
                </div>
            </div>

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center gap-3 lg:gap-6">
                {(user?.role === 'admin' || user?.role === 'super_admin') && (
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search properties, users..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white w-56 lg:w-72 transition-all placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    <button className="relative text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 p-2.5 rounded-full transition-all duration-200 ease-in-out group">
                        <Bell size={20} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                <div className="flex items-center gap-3 group relative cursor-pointer pl-1 py-1 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all pr-3">
                    <div className="flex-shrink-0 relative">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow" />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 border-2 border-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="hidden lg:block text-left pr-1">
                        <p className="text-sm font-bold text-slate-900 leading-none mb-0.5 group-hover:text-indigo-600 transition-colors">
                            {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            My Account
                        </p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors hidden lg:block" />

                    {/* Popover Dropdown */}
                    <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 origin-top-right z-50 p-2">
                        <div className="px-4 py-3 border-b border-slate-100 mb-2">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors">
                            My Profile
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors">
                            Settings
                        </Link>
                        <div className="h-px bg-slate-100 my-2 mx-2"></div>
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
