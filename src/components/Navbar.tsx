
"use client";
import type React from 'react';
import Link from 'next/link';
import { Home, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Tareas', icon: Home },
    { href: '/workers', label: 'Trabajadores', icon: Users },
  ];

  return (
    <nav className="bg-card shadow-sm mb-6 sm:mb-8">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? 'default' : 'ghost'}
                asChild
                className={cn(
                  "text-sm font-medium px-3 py-2 sm:px-4",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden sr-only">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
