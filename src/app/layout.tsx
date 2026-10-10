import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RoommateHub | Housing & Roommate Matching Platform',
    template: '%s | RoommateHub',
  },
  description:
    'Find verified urban apartments, rent rooms, and match with compatible roommates based on lifestyle habits, budget, and location preferences.',
  keywords: [
    'housing platform',
    'roommate finder',
    'verified apartments',
    'co-living',
    'rent room',
    'sublet',
  ],
  authors: [{ name: 'RoommateHub Team' }],
  openGraph: {
    title: 'RoommateHub | Housing & Roommate Matching Platform',
    description:
      'Find verified urban apartments, rent rooms, and match with compatible roommates based on lifestyle habits, budget, and location preferences.',
    type: 'website',
    locale: 'en_US',
    siteName: 'RoommateHub',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <ToasterProvider />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
