
"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3 md:gap-4">
        {/* Placeholder for Search - can be developed later */}
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Buscar">
          <Search className="h-5 w-5" />
        </Button>
        {/* Placeholder for Notifications - can be developed later */}
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
        </Button>
        {/* Placeholder for User Avatar - can be developed later */}
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://placehold.co/40x40.png" alt="Usuario" data-ai-hint="user avatar" />
          <AvatarFallback>SA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
