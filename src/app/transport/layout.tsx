import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nunes Transport & Fleet Intelligence — Tamil Nadu (Bus, Lorry, Govt & 3PL Logistics)',
  description: 'Tamil Nadu Bus, Lorry, Govt STUs and 3PL Logistics Master Directory. Certified fleet data, verified owner WhatsApp & phone contacts, regional branch depots, official circulars, and live Google Maps fleet corridors across Tamil Nadu.',
  keywords: [
    'Tamil Nadu transport directory',
    'lorry owners association',
    'omni bus owners association',
    'TOBOA',
    'SLOF',
    'Namakkal truck fleet',
    'Sankagiri bulker',
    'Coimbatore transport',
    'Nunes Instruments'
  ],
  openGraph: {
    title: 'Nunes Transport & Fleet Intelligence — Tamil Nadu',
    description: 'Master Directory for Tamil Nadu Bus & Lorry Transport Fleets with verified owner phone, WhatsApp numbers, regional branches, and circular dispatch system.',
    url: 'https://nunes-transport.vercel.app/transport',
    siteName: 'Nunes Instruments Transport Intelligence',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
