import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nunes AI School Directory — Tamil Nadu (All 38 Districts)',
  description: 'Production-ready official school intelligence directory for all 38 districts of Tamil Nadu, India. Curated by Nunes Instruments.',
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
