import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nunes AI School Directory — South India (Tamil Nadu & Kerala)',
  description: 'Production-ready official school intelligence directory for all 52 districts across Tamil Nadu and Kerala, India. Curated by Nunes Instruments with 1-click circular automation.',
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
