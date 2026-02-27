import React from 'react';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';

export default function DashboardLayout({ children }) {
    return (
        <DashboardLayoutWrapper>
            {children}
        </DashboardLayoutWrapper>
    );
}
