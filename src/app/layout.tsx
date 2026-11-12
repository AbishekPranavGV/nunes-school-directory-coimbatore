import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nunes AI School Directory — Coimbatore District',
  description: 'Production-ready official school directory for Coimbatore district, Tamil Nadu, India. Curated by Nunes Instruments.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-200">
        {children}
      </body>
    </html>
  );
}
