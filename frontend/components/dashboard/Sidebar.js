"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Heart,
    Calendar,
    MessageCircle,
    User,
    Settings,
    LogOut,
    Search,
    MapPin,
    Clock,
    ArrowRight,
    ShieldCheck,
    GitCompare,
    Globe,
    Lock,
    Activity,
    Database,
    Shield,
    DollarSign,
    Flag,
    FileText,
    Building,
    Home,
    Eye,
    PlusCircle,
    Users,
    AlertCircle,
    BarChart3
} from 'lucide-react';

export default function Sidebar({ isMobileOpen, setMobileOpen }) {
    const [role, setRole] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                setRole(userObj.role);
            } catch (e) {
                console.error("Failed to parse user role");
            }
        }
    }, []);

    // Define navigation links based on role
    const getNavLinks = () => {
        switch (role) {
            case 'super_admin':
                return [
                    { href: '/dashboard/super-admin', label: 'Dashboard Overview', icon: Activity },
                    { href: '#', label: 'Governance & Access', icon: Shield },
                    { href: '#', label: 'Financial Reports', icon: DollarSign },
                    { href: '#', label: 'Reports & Flags', icon: Flag },
                    { href: '#', label: 'Content & CMS', icon: FileText },
                    { href: '#', label: 'Platform Settings', icon: Settings },
                    { href: '#', label: 'Data Management', icon: Database },
                ];
            case 'admin':
                return [
                    { href: '/dashboard/admin', label: 'Overview', icon: BarChart3 },
                    { href: '#', label: 'Property Moderation', icon: ShieldCheck, badge: "5" },
                    { href: '#', label: 'User Management', icon: Users },
                    { href: '#', label: 'System Alerts', icon: AlertCircle, badgeColor: "bg-rose-500 text-white", badge: "1" },
                    { isDivider: true, label: "Settings" },
                    { href: '#', label: 'System Configuration', icon: Settings },
                ];
            case 'landlord':
                return [
                    { href: '/dashboard/landlord', label: 'Overview', icon: Home },
                    { href: '#', label: 'My Listings', icon: Building },
                    { href: '#', label: 'Leads', icon: MessageCircle },
                    { href: '/dashboard/landlord/post-property', label: 'List New Property', icon: PlusCircle },
                ];
            case 'agent':
            case 'staff':
                return [
                    { href: `/dashboard/${role}`, label: 'Overview', icon: Home },
                    { href: '#', label: 'Managed Listings', icon: Building },
                    { href: '#', label: 'Clients', icon: Users },
                    { href: '#', label: 'Messages', icon: MessageCircle },
                ];
            case 'tenant':
            case 'buyer':
            default:
                // Default User Dashboard (Buyer/Tenant)
                return [
                    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { href: '#', label: 'Saved', icon: Heart },
                    { href: '#', label: 'Bookings', icon: Calendar },
                    { href: '/compare', label: 'Comparisons', icon: GitCompare },
                    { href: '#', label: 'Messages', icon: MessageCircle },
                ];
        }
    };

    const navLinks = getNavLinks();

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between lg:justify-start px-8 border-b border-slate-100/50 bg-white/80 backdrop-blur-xl">
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <img
                            src=" "
                            alt=" "
                            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                            Elite Estates
                        </span>
                    </Link>
                    <button className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navLinks.map((link, index) => {
                        if (link.isDivider) {
                            return (
                                <div key={index} className="pt-8 pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-4">
                                    {link.label}
                                </div>
                            );
                        }

                        const Icon = link.icon;
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard' && link.href !== '/');

                        return (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50 relative overflow-hidden' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
                                )}
                                <div className="flex items-center gap-3.5 relative z-10">
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} transition-colors duration-200`} />
                                    <span>{link.label}</span>
                                </div>
                                {link.badge && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${link.badgeColor || 'bg-slate-900 text-white shadow-sm'}`}>
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Settings Link */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <Link href="/profile" className="flex items-center gap-3.5 text-slate-500 hover:text-slate-900 hover:bg-white w-full px-4 py-3 rounded-xl transition-all duration-200 shadow-sm border border-transparent hover:border-slate-200 group">
                        <User size={18} strokeWidth={2} className="group-hover:text-indigo-600 transition-colors" />
                        <span className="font-semibold text-sm">My Profile</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}

// Simple fallback X icon if lucide import is missed above
function X({ size = 24 }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={size} height={size}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
