import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist_Sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ // Changed from geistSans and Geist_Sans
  variable: '--font-inter', // Changed CSS variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Día Maestro',
  description: 'Organize your daily tasks with Día Maestro',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}> {/* Use new font variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
