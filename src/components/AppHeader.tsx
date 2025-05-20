
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggleButton from '@/components/ThemeToggleButton';
import type { ProfileData } from '@/types/profile';

interface AppHeaderProps {
  title: string;
}

const LOCAL_STORAGE_KEY_PROFILE = 'diaMaestroProfile';

export default function AppHeader({ title }: AppHeaderProps) {
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  const [avatarFallback, setAvatarFallback] = useState<string>('SA');
  const [isMounted, setIsMounted] = useState(false);

  const updateAvatarFromStorage = () => {
    const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile) as ProfileData;
        setAvatarSrc(parsedProfile.avatarDataUrl);
        if (parsedProfile.name) {
          setAvatarFallback(parsedProfile.name.substring(0, 2).toUpperCase());
        } else {
          setAvatarFallback('SA');
        }
      } catch (e) {
        console.error("Failed to parse profile for avatar", e);
        setAvatarSrc(undefined);
        setAvatarFallback('SA');
      }
    } else {
      setAvatarSrc(undefined);
      setAvatarFallback('SA');
    }
  };

  useEffect(() => {
    setIsMounted(true);
    updateAvatarFromStorage();

    const handleProfileUpdate = (event: Event) => {
        const customEvent = event as CustomEvent<ProfileData>;
        if (customEvent.detail) {
            setAvatarSrc(customEvent.detail.avatarDataUrl);
            if (customEvent.detail.name) {
                setAvatarFallback(customEvent.detail.name.substring(0, 2).toUpperCase());
            } else {
                setAvatarFallback('SA');
            }
        }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Buscar">
          <Search className="h-5 w-5" />
        </Button>
        <ThemeToggleButton /> 
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9">
           <AvatarImage 
            src={isMounted && avatarSrc ? avatarSrc : "https://placehold.co/40x40.png"} 
            alt="Usuario" 
            data-ai-hint="user avatar" 
           />
          <AvatarFallback>{isMounted ? avatarFallback : 'SA'}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
