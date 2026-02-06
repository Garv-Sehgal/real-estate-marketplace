"use client";

import React from 'react';
import { Globe, Settings, Lock, Activity, Server, Database, Shield, DollarSign, TrendingUp, Users, AlertTriangle, Power } from 'lucide-react';

export default function SuperAdminDashboard() {
    return (
        <div className="min-h-screen bg-neutral-100 flex font-sans text-neutral-900">

            {/* God Mode Sidebar */}
            <aside className="w-20 lg:w-72 bg-black text-neutral-400 flex flex-col transition-all duration-300">
                <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-neutral-900">
                    <div className="flex items-center gap-3 text-white font-bold tracking-widest text-lg">
                        <Globe className="text-blue-500 animate-pulse" />
                        <span className="hidden lg:block">NEXUS<span className="text-blue-500">CORE</span></span>
                    </div>
                </div>

                <nav className="flex-1 py-6 space-y-2">
                    <MenuLink icon={<Activity />} label="Global Overview" active />
                    <MenuLink icon={<Shield />} label="Security & Access" />
                    <MenuLink icon={<DollarSign />} label="Financials" />
                    <MenuLink icon={<Settings />} label="System Config" />
                    <MenuLink icon={<Database />} label="Database" />
                </nav>

                <div className="p-4 border-t border-neutral-900">
                    <button className="flex items-center gap-3 text-red-500 hover:text-red-400 hover:bg-red-950/30 w-full p-3 rounded-lg transition-colors">
                        <Power size={20} />
                        <span className="hidden lg:block font-medium">Emergency Stop</span>
                    </button>
                </div>
            </aside>

            {/* Main Canvas */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden text-sm">

                {/* Top Info Bar */}
                <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-8">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold text-neutral-900">System Overview</h1>
                        <div className="px-3 py-1 bg-green-100 border border-green-200 text-green-700 rounded-full text-xs font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            ALL SYSTEMS OPERATIONAL
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                        <span>V.4.2.0-RC1</span>
                        <span>Latency: 24ms</span>
                        <div className="w-8 h-8 bg-neutral-900 rounded-md flex items-center justify-center text-white font-bold text-xs">SA</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* 1. Global Analytics (Revenue & Growth) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-2 bg-white rounded-none border border-neutral-200 p-6 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Revenue</h3>
                                    <p className="text-3xl font-bold text-neutral-900 font-mono">₹ 14,240,000</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">
                                    <TrendingUp size={14} /> +24% MoM
                                </div>
                            </div>
                            {/* Placeholder Chart */}
                            <div className="h-48 w-full flex items-end justify-between gap-1 relative z-10 opacity-80">
                                {[40, 65, 45, 78, 55, 80, 70, 95, 85, 60, 75, 90].map((h, i) => (
                                    <div key={i} className="w-full bg-blue-600 hover:bg-blue-700 transition-colors" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl -mr-16 -mt-16"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-neutral-900 text-white p-6 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Active Subscriptions</h3>
                                    <p className="text-2xl font-bold font-mono">2,405</p>
                                </div>
                                <Users className="absolute top-6 right-6 text-neutral-800 group-hover:text-neutral-700 transition-colors" size={48} />
                            </div>
                            <div className="bg-white border border-neutral-200 p-6">
                                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Infrastructure Load</h3>
                                <div className="space-y-4">
                                    <ProgressBar label="CPU Usage" value={45} color="bg-green-500" />
                                    <ProgressBar label="Memory" value={72} color="bg-yellow-500" />
                                    <ProgressBar label="Storage" value={28} color="bg-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* 2. User Authority & Config */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* User Authority Table */}
                            <section className="bg-white border border-neutral-200">
                                <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
                                    <h2 className="font-bold text-neutral-900 flex items-center gap-2">
                                        <Lock size={16} className="text-neutral-500" /> Admin Authority
                                    </h2>
                                    <button className="text-xs font-bold bg-neutral-900 text-white px-3 py-1.5 hover:bg-neutral-800 transition-colors">
                                        Grant Access
                                    </button>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="text-xs font-bold text-neutral-500 uppercase bg-white border-b border-neutral-100">
                                        <tr>
                                            <th className="px-6 py-3">User</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Permissions</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 font-mono text-xs">
                                        <AdminRow name="Sarah Connor" email="sarah@elite.com" role="SUPER_ADMIN" perms="ALL_ACCESS" />
                                        <AdminRow name="John Wick" email="john@elite.com" role="MODERATOR" perms="READ_WRITE" />
                                        <AdminRow name="Bruce Wayne" email="bruce@elite.com" role="BILLING" perms="FINANCE_ONLY" />
                                    </tbody>
                                </table>
                            </section>

                            {/* System Config Grid */}
                            <section className="bg-white border border-neutral-200 p-6">
                                <h2 className="font-bold text-neutral-900 mb-6 flex items-center gap-2">
                                    <Settings size={16} className="text-neutral-500" /> System Variables
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ConfigItem label="Base Commission Rate" value="2.5%" />
                                    <ConfigItem label="Max Listings / Free User" value="1" />
                                    <ConfigItem label="Stripe Integration" value="CONNECTED" status="text-green-600" />
                                    <ConfigItem label="Maintenance Mode" value="DISABLED" status="text-neutral-400" />
                                </div>
                            </section>

                        </div>

                        {/* 3. Live Activity Feed */}
                        <div className="bg-neutral-900 text-neutral-400 p-6 flex flex-col h-[500px]">
                            <h2 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Activity size={16} className="text-blue-500" /> Live Feed
                            </h2>
                            <div className="flex-1 overflow-y-auto space-y-6 font-mono text-xs pr-2">
                                <LogItem time="16:42:05" type="INFO" msg="User authentication success: admin@elite.com" />
                                <LogItem time="16:40:12" type="WARN" msg="High latency detected in us-east-1 region" color="text-yellow-500" />
                                <LogItem time="16:35:22" type="Action" msg="Property #4928 approved by Moderator" color="text-blue-400" />
                                <LogItem time="16:30:00" type="CRITICAL" msg="Payment gateway timeout (recovered)" color="text-red-500" />
                                <LogItem time="16:28:45" type="INFO" msg="Daily backup completed successfully" />
                                <LogItem time="16:25:10" type="Action" msg="User #882 suspended by SuperAdmin" color="text-orange-400" />
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}

// Components
function MenuLink({ icon, label, active }) {
    return (
        <a href="#" className={`flex items-center gap-4 px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors ${active ? 'text-white border-l-4 border-blue-600 bg-neutral-900' : 'border-l-4 border-transparent'}`}>
            {React.cloneElement(icon, { size: 20 })}
            <span className="hidden lg:block font-medium">{label}</span>
        </a>
    )
}

function ProgressBar({ label, value, color }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    )
}

function AdminRow({ name, email, role, perms }) {
    return (
        <tr className="hover:bg-neutral-50 transition-colors">
            <td className="px-6 py-4">
                <div className="font-bold text-neutral-900">{name}</div>
                <div className="text-neutral-500 text-[10px]">{email}</div>
            </td>
            <td className="px-6 py-4">
                <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200 font-bold">{role}</span>
            </td>
            <td className="px-6 py-4 text-neutral-600">{perms}</td>
            <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 font-bold px-2">Edit</button>
                <button className="text-red-600 hover:text-red-800 font-bold px-2">Suspend</button>
            </td>
        </tr>
    )
}

function ConfigItem({ label, value, status }) {
    return (
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
            <span className="text-neutral-500 font-medium">{label}</span>
            <span className={`font-bold ${status || 'text-neutral-900'}`}>{value}</span>
        </div>
    )
}

function LogItem({ time, type, msg, color }) {
    return (
        <div className="flex gap-3">
            <span className="text-neutral-600 shrink-0">{time}</span>
            <span className={`font-bold shrink-0 w-12 ${color || 'text-neutral-500'}`}>{type}</span>
            <span className="text-neutral-300">{msg}</span>
        </div>
    )
}
