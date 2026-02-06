"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Heart,
    Calendar,
    MessageCircle,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Bell,
    Search,
    MapPin,
    Clock,
    ArrowRight,
    ShieldCheck,
    ArrowUpRight,
    GitCompare
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

// --- MOCK DATA ---

const USER_PROFILE = {
    name: "Alex",
    fullName: "Alex Johnson",
    role: "Premium Member",
    email: "alex.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    memberSince: "Jan 2024"
};

const STATS = [
    { label: "Properties Viewed", value: "124", change: "+12%", icon: Search, color: "bg-blue-50 text-blue-600" },
    { label: "Saved Homes", value: "8", change: "+2", icon: Heart, color: "bg-rose-50 text-rose-600" },
    { label: "Contacted Agents", value: "5", change: "0", icon: MessageCircle, color: "bg-purple-50 text-purple-600" },
    { label: "Scheduled Visits", value: "3", change: "+1", icon: Calendar, color: "bg-amber-50 text-amber-600" },
];

const SAVED_PROPERTIES = [
    {
        id: 1,
        title: "3 BHK Luxury Apartment",
        location: "Indiranagar, Bangalore",
        price: "₹ 1.25 Cr",
        pricePerSqft: "₹ 6,750 per sqft",
        bhk: "3 BHK",
        area: "1850 sqft",
        baths: "3 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 12,
        isVerified: true,
        tag: "Trending"
    },
    {
        id: 4,
        title: "3 BHK Garden Facing",
        location: "Hebbal, Bangalore",
        price: "₹ 1.10 Cr",
        pricePerSqft: "₹ 6,400 per sqft",
        bhk: "3 BHK",
        area: "1650 sqft",
        baths: "3 Baths",
        status: "Ready to Move",
        image: "https://images.unsplash.com/photo-1599809275372-b40c369dd6cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photos: 15,
        isVerified: true,
        tag: "Featured"
    }
];

const BOOKINGS = [
    { id: 101, property: "4 BHK Premium Villa", date: "Oct 24, 2025", time: "10:00 AM", status: "Scheduled", agent: "Sarah Smith", image: "https://images.unsplash.com/photo-1613490493576-2f5033157979?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
    { id: 102, property: "2 BHK Cozy Flat", date: "Oct 20, 2025", time: "2:00 PM", status: "Completed", agent: "Mike Ross", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
];

const MESSAGES = [
    { id: 1, sender: "Sarah Smith", role: "Real Estate Agent", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", time: "2m ago", preview: "Hi Alex, are you still interested in the Villa?", unread: true },
    { id: 2, sender: "Elite Support", role: "Customer Service", avatar: "https://ui-avatars.com/api/?name=Elite+Support&background=0D8ABC&color=fff", time: "1d ago", preview: "Your verification request has been approved.", unread: false },
];

// --- COMPONENTS ---

const SectionHeader = ({ title, action }) => (
    <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {action && (
            <button className="text-sm font-semibold text-[#4169E1] hover:text-blue-700 flex items-center gap-1 transition-colors group">
                {action}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        )}
    </div>
);

const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-100/50 text-green-700' : 'bg-gray-100/50 text-gray-500'}`}>
                    {stat.change}
                </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
        </div>
    );
};

const BookingCard = ({ booking }) => (
    <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-lg transition-all duration-300 group cursor-pointer w-full">
        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            <img src={booking.image} alt="Property" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 truncate pr-2 group-hover:text-[#4169E1] transition-colors">{booking.property}</h4>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
          ${booking.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {booking.status}
                </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-1.5">
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> {booking.date}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> {booking.time}
                </span>
            </div>
        </div>
    </div>
);

const ComparisonActionCard = () => (
    <div className="bg-gradient-to-br from-[#4169E1] to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
        <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-1">Compare Properties</h3>
            <p className="text-blue-100 text-sm mb-4 max-w-[80%]">You have 2 properties in your comparison list.</p>
            <button className="px-4 py-2 bg-white text-[#4169E1] text-sm font-bold rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-2">
                Compare Now <ArrowRight className="w-3 h-3" />
            </button>
        </div>
    </div>
);

const MessagePreview = ({ message }) => (
    <div className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex gap-4 group
    ${message.unread
            ? 'bg-white border-blue-100 shadow-[0_2px_15px_-3px_rgba(65,105,225,0.15)]'
            : 'bg-white/50 border-transparent hover:bg-white hover:border-gray-100'
        }`}>
        <div className="relative flex-shrink-0">
            <img src={message.avatar} alt={message.sender} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
            {message.unread && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#4169E1] border-2 border-white rounded-full"></span>}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
                <h4 className={`text-sm ${message.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{message.sender}</h4>
                <span className="text-xs text-gray-400 font-medium">{message.time}</span>
            </div>
            <p className={`text-sm truncate leading-relaxed ${message.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {message.preview}
            </p>
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('home');

    // Desktop Navigation Items
    const DESKTOP_NAV = [
        { id: 'home', label: 'Dashboard' },
        { id: 'saved', label: 'Saved' },
        { id: 'bookings', label: 'Bookings' },
        { id: 'comparisons', label: 'Comparisons' },
        { id: 'messages', label: 'Messages' },
    ];

    // Mobile Navigation Items
    const MOBILE_NAV = [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'saved', label: 'Saved', icon: Heart },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 2 },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Welcome Hero */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    Welcome back, {USER_PROFILE.name} 👋
                                </h1>
                                <p className="text-gray-500 mt-1">Here's what's happening with your property search.</p>
                            </div>
                            {/* On Desktop, Profile is in Topbar, so we don't need context buttons here usually, but keeping a quick Settings action is fine */}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {STATS.map((stat, idx) => <StatCard key={idx} stat={stat} />)}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Comparison Card (New Section) */}
                            <div className="lg:col-span-1">
                                <ComparisonActionCard />

                                <div className="mt-8">
                                    <SectionHeader title="Recent Messages" action="View All" />
                                    <div className="space-y-3">
                                        {MESSAGES.map(msg => <MessagePreview key={msg.id} message={msg} />)}
                                    </div>
                                </div>
                            </div>

                            {/* Listings & Bookings */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <SectionHeader title="Upcoming Visits" action="Calendar" />
                                    <div className="space-y-3">
                                        {BOOKINGS.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader title="Recently Saved" action="View All" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {SAVED_PROPERTIES.slice(0, 2).map(prop => <PropertyCard key={prop.id} property={prop} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'saved':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-500">{SAVED_PROPERTIES.length} Items</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {SAVED_PROPERTIES.map(prop => <PropertyCard key={prop.id} property={prop} />)}
                        </div>
                    </div>
                );

            case 'bookings':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Bookings & Visits</h1>
                            <button className="text-sm font-bold text-[#4169E1] px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                + Schedule New
                            </button>
                        </div>
                        <div className="space-y-4">
                            {BOOKINGS.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                        </div>
                    </div>
                );

            case 'comparisons':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Comparisons</h1>
                            <Link href="/compare" className="text-sm font-bold text-white px-4 py-2 bg-[#4169E1] rounded-lg hover:bg-blue-600 transition-colors">
                                Open Comparison Tool
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Placeholder for specific comparison sets */}
                            <ComparisonActionCard />
                        </div>
                    </div>
                );

            case 'messages':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
                        <div className="space-y-3">
                            {MESSAGES.map(msg => <MessagePreview key={msg.id} message={msg} />)}
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                            <div className="w-24 h-24 rounded-full mx-auto mb-4 p-1 bg-gradient-to-tr from-[#4169E1] to-purple-500">
                                <div className="w-full h-full rounded-full border-4 border-white overflow-hidden">
                                    <img src={USER_PROFILE.avatar} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{USER_PROFILE.fullName}</h2>
                            <p className="text-gray-500 font-medium mb-6">{USER_PROFILE.role}</p>

                            <div className="flex justify-center gap-3 mb-8">
                                <button className="px-6 py-2 bg-[#4169E1] text-white font-bold rounded-full shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                    Edit Profile
                                </button>
                                <button className="px-6 py-2 bg-gray-50 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors">
                                    Settings
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">12</div>
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Saved</div>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <div className="text-2xl font-bold text-gray-900">5</div>
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Visits</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                            {['Account Security', 'Notification Preferences', 'Payment Methods', 'Help & Support'].map((item) => (
                                <button key={item} className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors group">
                                    <span className="font-medium text-gray-700 group-hover:text-gray-900">{item}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                            <button className="w-full text-left px-6 py-4 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">

            {/* --- DESKTOP TOP NAVIGATION BAR --- */}
            <header className="hidden md:flex bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 h-[72px] items-center px-6 lg:px-10 justify-between shadow-[0_2px_20px_-2px_rgba(0,0,0,0.02)] transition-all">

                {/* Left: Brand */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#4169E1] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300 transform group-hover:scale-105">E</div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-[#4169E1] transition-colors">Elite Estates</span>
                </div>

                <nav className="flex items-center gap-2 bg-white/50 p-1.5 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
                    {DESKTOP_NAV.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative
                   ${activeTab === item.id
                                    ? 'bg-gradient-to-r from-[#4169E1] to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Right: User Profile */}
                <div className="flex items-center gap-5">
                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-2 border-r border-gray-100 pr-5">
                        <button className="p-2.5 text-gray-400 hover:text-[#4169E1] hover:bg-blue-50/50 rounded-full transition-all duration-300 relative group">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-[#4169E1] hover:bg-blue-50/50 rounded-full transition-all duration-300 relative group">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white scale-0 group-hover:scale-100 transition-transform"></span>
                        </button>
                    </div>

                    {/* Profile User */}
                    <button
                        onClick={() => setActiveTab('profile')}
                        className="flex items-center gap-3 pl-1 pr-2 py-1 hover:bg-gray-50 rounded-full border border-transparent hover:border-gray-100 transition-all duration-200 group"
                    >
                        <div className="relative">
                            <img src={USER_PROFILE.avatar} alt="User" className="w-10 h-10 rounded-full object-cover border-[3px] border-white shadow-sm group-hover:shadow-md transition-shadow" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="text-left hidden lg:block">
                            <div className="text-sm font-bold text-gray-900 leading-none mb-0.5 group-hover:text-[#4169E1] transition-colors">{USER_PROFILE.name}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Premium</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-[#4169E1] transition-colors ml-1" />
                    </button>
                </div>
            </header>


            {/* --- CONTENT AREA (Centered on Desktop) --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto md:px-10 py-6 md:py-10">

                {/* Mobile Header (Keep strict) */}
                <header className="md:hidden sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center mb-6">
                    <div className="font-bold text-lg text-gray-900">Elite Estates</div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                        <img src={USER_PROFILE.avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                </header>

                <div className="px-4 md:px-0 pb-28 md:pb-0">
                    {renderContent()}
                </div>

            </main>


            {/* --- MOBILE BOTTOM NAV (Keep as-is) --- */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                <div className="flex justify-around items-center px-2">
                    {MOBILE_NAV.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all
                    ${activeTab === item.id ? 'text-[#4169E1]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div className="relative">
                                <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current opacity-20 stroke-[2.5px]' : ''}`} />
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold tracking-wide">{item.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </nav>

        </div>
    );
}
