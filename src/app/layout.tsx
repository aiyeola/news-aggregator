import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layouts/AppLayout';

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'News Aggregator',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable}`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
