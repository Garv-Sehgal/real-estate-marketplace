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
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-border-dark bg-white/95 dark:bg-background-dark/95 backdrop-blur-md transition-all duration-300">
            <div className="w-full px-6 md:px-12 lg:px-16">
                <div className="flex justify-between items-center h-[72px] py-4">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <img
                            src="/images/Elite_Estates Logo.png"
                            alt="SPRxElite Estate Logo"
                            className="h-16 w-auto object-contain"
                        />
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                            SPRxElite Estates
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="#" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors uppercase tracking-wide">Blog</Link>
                        <Link href="#" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors tracking-wide">FAQs</Link>
                        <Link href="#" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors uppercase tracking-wide">Insights</Link>
                        <Link href="#" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors uppercase tracking-wide">About Us</Link>
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
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-surface-dark shadow-2xl rounded-xl border border-slate-100 dark:border-border-dark overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <div className="p-2 space-y-1">
                                    {/* User Login */}
                                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group/item">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white group-hover/item:text-blue-600 transition-colors">User Login</p>
                                            <p className="text-[10px] text-slate-500 font-medium">I&apos;m a Buyer/Tenant</p>
                                        </div>
                                    </Link>

                                    {/* Landlord Login */}
                                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group/item">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shrink-0">
                                            <Home className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white group-hover/item:text-blue-600 transition-colors">Landlord Login</p>
                                            <p className="text-[10px] text-slate-500 font-medium">I&apos;m a Property Owner</p>
                                        </div>
                                    </Link>

                                    {/* Agent Login */}
                                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group/item">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shrink-0">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white group-hover/item:text-blue-600 transition-colors">Agent Login</p>
                                            <p className="text-[10px] text-slate-500 font-medium">I&apos;m a Real Estate Pro</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="border-t border-slate-100 dark:border-border-dark p-4 bg-slate-50/50 dark:bg-slate-800/30">
                                    <p className="text-xs font-medium text-slate-500 mb-2">New User?</p>
                                    <Link href="/register" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group/link">
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
