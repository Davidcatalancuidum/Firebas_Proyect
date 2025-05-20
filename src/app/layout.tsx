import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  variable: '--font-inter', 
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Día Maestro',
  description: 'Organiza tus tareas diarias con Día Maestro',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark"> {/* Apply dark class globally if you want dark mode by default */}
      <body className={cn(inter.variable, "font-sans antialiased bg-background text-foreground")}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              {children}
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
