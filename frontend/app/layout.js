import './globals.css';

export const metadata = {
    title: 'Elite Estates',
    description: 'AI-powered Real Estate Marketplace PWA',
    manifest: '/manifest.json',
};

export const viewport = {
    themeColor: '#1d4ed8',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
