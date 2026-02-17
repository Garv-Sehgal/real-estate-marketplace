import './globals.css';

export const metadata = {
    title: 'SPRxElite Estates',
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
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    );
}
