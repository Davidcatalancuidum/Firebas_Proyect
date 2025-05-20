
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'; 
import { Home, Users, Settings, HelpCircle, ShieldCheck, ListChecks, Award, CheckCircle, Star, Zap, UserCircle as UserCircleIcon } from 'lucide-react'; 
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  icon: React.ElementType;
  title: string;
  price: string;
  priceDetails: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  highlight?: boolean;
  href: string;
}

const plansData: Plan[] = [
  {
    id: 'basic',
    icon: CheckCircle,
    title: 'Basico',
    price: '1€',
    priceDetails: 'por mes',
    description: 'Ideal para empezar y organizar tus tareas personales.',
    features: [
      { text: 'Hasta 50 tareas', included: true },
      { text: 'Gestión de trabajadores (hasta 2)', included: true },
      { text: 'Calendario de tareas', included: true },
      { text: 'Soporte por email', included: false },
      { text: 'Integraciones básicas', included: false },
    ],
    buttonText: 'Más sobre Basico',
    href: '/planes#basic',
  },
  {
    id: 'estandar',
    icon: Star,
    title: 'Estándar',
    price: '5€',
    priceDetails: 'por mes',
    description: 'Perfecto para pequeños equipos y mayor productividad.',
    features: [
      { text: 'Tareas ilimitadas', included: true },
      { text: 'Gestión de trabajadores (hasta 10)', included: true },
      { text: 'Calendario avanzado con recordatorios', included: true },
      { text: 'Soporte prioritario por email', included: true },
      { text: 'Integraciones (Próximamente)', included: false },
    ],
    buttonText: 'Elegir Estándar',
    highlight: true,
    href: '/planes#estandar',
  },
  {
    id: 'pro', 
    icon: Zap,
    title: 'Premium', 
    price: '10€',
    priceDetails: 'por mes',
    description: 'Todas las funcionalidades para profesionales y empresas.',
    features: [
      { text: 'Todo en Estándar', included: true },
      { text: 'Gestión de trabajadores (ilimitados)', included: true },
      { text: 'Informes y estadísticas (Próximamente)', included: true },
      { text: 'Acceso API (Próximamente)', included: true },
      { text: 'Soporte VIP 24/7', included: true },
    ],
    buttonText: 'Más sobre Premium',
    href: '/planes#pro', 
  },
];


export default function AppSidebar() {
  const pathname = usePathname();
  const [isProDialogOpen, setIsProDialogOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Tareas', icon: ListChecks },
    { href: '/workers', label: 'Trabajadores', icon: Users },
    { href: '/perfil', label: 'Mi Perfil', icon: UserCircleIcon },
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
          onClick={() => setIsProDialogOpen(true)}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Conviértete en Pro
        </Button>
         <Button 
          variant="outline" 
          size="icon"
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground hidden group-data-[collapsible=icon]:flex justify-center items-center"
          aria-label="Conviértete en Pro"
          onClick={() => setIsProDialogOpen(true)}
        >
          <ShieldCheck className="h-5 w-5" />
        </Button>
      </SidebarFooter>

      <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
        <DialogContent className="sm:max-w-2xl p-0"> 
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl font-bold">Elige tu Plan Perfecto</DialogTitle>
            <DialogDescription>
              Desbloquea más funcionalidades y lleva tu productividad al siguiente nivel.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto px-6 pb-6 space-y-4">
            {plansData.map((plan) => (
              <Card 
                key={plan.id} 
                className={`flex flex-col ${plan.highlight ? 'border-primary ring-2 ring-primary shadow-primary/20' : 'shadow-md'}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <plan.icon className={`mr-2 h-6 w-6 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                      {plan.title}
                    </CardTitle>
                    {plan.highlight && (
                       <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">Popular</span>
                    )}
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="ml-1 text-lg font-medium text-muted-foreground">{plan.priceDetails}</span>
                  </div>
                  <CardDescription className="pt-2 text-xs min-h-[30px]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xs">
                        <CheckCircle 
                          className={`h-3.5 w-3.5 mr-2 flex-shrink-0 ${feature.included ? 'text-primary' : 'text-muted-foreground/50'}`} 
                        />
                        <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/70 line-through'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <DialogClose asChild>
                    <Link href={plan.href} passHref legacyBehavior>
                      <Button asChild className="w-full text-sm py-2.5" variant={plan.highlight ? 'default' : 'outline'}>
                        <a>{plan.buttonText}</a>
                      </Button>
                    </Link>
                  </DialogClose>
                </CardFooter>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
