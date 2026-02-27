"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayoutWrapper({ children }) {
    const [isMobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
            <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Topbar setMobileOpen={setMobileOpen} />

                <main className="flex-1 overflow-y-auto w-full pb-24 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
