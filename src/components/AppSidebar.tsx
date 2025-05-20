
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Settings, HelpCircle, ShieldCheck, ListChecks, Award } from 'lucide-react';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar'; 
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Tareas', icon: ListChecks },
    { href: '/workers', label: 'Trabajadores', icon: Users },
  ];

  const supportItems = [
    { href: '/ayuda', label: 'Ayuda', icon: HelpCircle },
    { href: '/integraciones', label: 'Integraciones', icon: Settings },
    { href: '/planes', label: 'Planes', icon: Award },
  ];

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          {/* Placeholder Logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Día Maestro</h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="flex-grow p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">MENÚ</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  className={cn(
                    pathname === item.href ? 
                    "bg-sidebar-accent text-sidebar-accent-foreground" : 
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">SOPORTE</SidebarGroupLabel>
          <SidebarMenu>
            {supportItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                   className={cn(
                    pathname === item.href ? 
                    "bg-sidebar-accent text-sidebar-accent-foreground" : 
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[collapsible=icon]:p-2">
        <Button 
          variant="outline" 
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground group-data-[collapsible=icon]:hidden"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Conviértete en Pro
        </Button>
         <Button 
          variant="outline" 
          size="icon"
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground hidden group-data-[collapsible=icon]:flex justify-center items-center"
          aria-label="Conviértete en Pro"
        >
          <ShieldCheck className="h-5 w-5" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
