"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    User,
    Home,
    Briefcase,
    ChevronDown,
    Plus,
    ArrowRight
} from 'lucide-react';


const Header = () => {
    const [activeSection, setActiveSection] = useState('');

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'blog', 'insights', 'faqs'];
            const scrollPosition = window.scrollY + 100;

            // Check if we're at the bottom of the page
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
                setActiveSection('about');
                return;
            }

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300">
            <div className="w-full px-6 md:px-12 lg:px-16">
                <div className="flex justify-between items-center h-[72px] py-4">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('')}>
                        <img
                            src="/images/Elite_Estates Logo.png"
                            alt="SPRxElite Estate Logo"
                            className="h-16 w-auto object-contain"
                        />
                        <span className="text-xl font-extrabold tracking-tight text-gray-900 whitespace-nowrap">
                            SPRxElite Estates
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a
                            href="#about"
                            onClick={(e) => scrollToSection(e, 'about')}
                            className={`text-sm font-bold transition-all uppercase tracking-wide cursor-pointer ${activeSection === 'about' ? 'text-blue-600 scale-105' : 'text-gray-900 hover:text-blue-600'}`}
                        >
                            About Us
                        </a>
                        <a
                            href="#blog"
                            onClick={(e) => scrollToSection(e, 'blog')}
                            className={`text-sm font-bold transition-all uppercase tracking-wide cursor-pointer ${activeSection === 'blog' ? 'text-blue-600 scale-105' : 'text-gray-900 hover:text-blue-600'}`}
                        >
                            Blog
                        </a>
                        <a
                            href="#faqs"
                            onClick={(e) => scrollToSection(e, 'faqs')}
                            className={`text-sm font-bold transition-all tracking-wide cursor-pointer ${activeSection === 'faqs' ? 'text-blue-600 scale-105' : 'text-gray-900 hover:text-blue-600'}`}
                        >
                            FAQs
                        </a>
                        <a
                            href="#insights"
                            onClick={(e) => scrollToSection(e, 'insights')}
                            className={`text-sm font-bold transition-all uppercase tracking-wide cursor-pointer ${activeSection === 'insights' ? 'text-blue-600 scale-105' : 'text-gray-900 hover:text-blue-600'}`}
                        >
                            Insights
                        </a>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">


                        <div className="relative group py-2">
                            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                                Login
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <div className="p-2 space-y-1">
                                    {/* User Login */}
                                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group/item">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">User Login</p>
                                            <p className="text-[10px] text-slate-500 font-medium">I&apos;m a Buyer/Tenant</p>
                                        </div>
                                    </Link>

                                    {/* Landlord Login */}
                                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group/item">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shrink-0">
                                            <Home className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">Landlord Login</p>
                                            <p className="text-[10px] text-slate-500 font-medium">I&apos;m a Property Owner</p>
                                        </div>
                                    </Link>

                                    {/* Agent Login */}
                                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group/item">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shrink-0">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors">Agent Login</p>
                                            <p className="text-[10px] text-slate-500 font-medium">I&apos;m a Real Estate Pro</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                                    <p className="text-xs font-medium text-slate-500 mb-2">New User?</p>
                                    <Link href="/register" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 group/link">
                                        Sign Up Now <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Preserved List Property Button */}
                        <Link
                            href="/dashboard/landlord/post-property"
                            className="hidden lg:flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" />
                            List Property
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
