"use client";

import React, { useState } from 'react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-border-dark bg-white/95 dark:bg-background-dark/95 backdrop-blur-md transition-all duration-300">
            <div className="w-full px-6 md:px-12 lg:px-16">
                <div className="flex justify-between items-center h-[72px] py-4">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 cursor-pointer">
                        <img
                            src="/images/Elite_Estates Logo.png"
                            alt="SPRxElite Estate Logo"
                            className="h-16 w-auto object-contain"
                        />
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                            SPRxElite Estates
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors uppercase tracking-wide" href="#">Blog</a>
                        <a className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors  tracking-wide" href="#">FAQs</a>
                        <a className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors uppercase tracking-wide" href="#">Insights</a>
                        <a className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors uppercase tracking-wide" href="#">About Us</a>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="p-2 rounded-full
             text-slate-700 dark:text-slate-300
             hover:bg-slate-100 dark:hover:bg-slate-800
             focus:outline-none focus:ring-0
             active:outline-none
             transition-colors"
                            onClick={() => document.documentElement.classList.toggle('dark')}
                        >
                            <span className="material-symbols-outlined text-2xl">
                                bedtime
                            </span>
                        </button>


                        <div className="relative group py-2">
                            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-white border border-slate-200 dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                Login
                                <span className="material-symbols-outlined text-xs">expand_more</span>
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-surface-dark shadow-2xl rounded-xl border border-slate-100 dark:border-border-dark overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <div className="p-2">
                                    <a className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group/item" href="#">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                            <span className="material-symbols-outlined text-xl">person</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">User Login</p>
                                            <p className="text-[10px] text-slate-500">I&apos;m a Buyer/Tenant</p>
                                        </div>
                                    </a>
                                    <a className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group/item" href="#">
                                        <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover/item:bg-green-600 group-hover/item:text-white transition-all">
                                            <span className="material-symbols-outlined text-xl">badge</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">Agent Login</p>
                                            <p className="text-[10px] text-slate-500">I&apos;m a Real Estate Pro</p>
                                        </div>
                                    </a>
                                </div>
                                <div className="border-t border-slate-100 dark:border-border-dark p-4 bg-slate-50/50 dark:bg-slate-800/30">
                                    <p className="text-xs font-medium text-slate-500 mb-2">New User?</p>
                                    <a className="text-sm font-bold text-primary hover:underline flex items-center gap-1" href="#">
                                        Sign Up Now <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Preserved List Property Button */}
                        <button className="hidden lg:flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                            <span className="material-symbols-outlined text-lg">add</span>
                            List Property
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
