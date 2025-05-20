
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ProfileData } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, UploadCloud, Save } from 'lucide-react';

const LOCAL_STORAGE_KEY_PROFILE = 'diaMaestroProfile';

const profileFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio.'),
  email: z.string().email('El correo electrónico no es válido.'),
  bio: z.string().max(500, 'La biografía no puede exceder los 500 caracteres.').optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isMounted, setIsMounted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
    }
  });

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as ProfileData;
        setProfileData(parsedProfile);
        setValue('name', parsedProfile.name || '');
        setValue('email', parsedProfile.email || '');
        setValue('bio', parsedProfile.bio || '');
        if (parsedProfile.avatarDataUrl) {
          setAvatarPreview(parsedProfile.avatarDataUrl);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error);
      toast({
        title: "Error al Cargar Perfil",
        description: "No se pudieron cargar los datos de tu perfil.",
        variant: "destructive",
      });
    }
  }, [setValue, toast]);

  const saveProfileData = useCallback((data: ProfileData) => {
    if (isMounted) {
      try {
        const currentProfileString = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
        const currentProfile = currentProfileString ? JSON.parse(currentProfileString) : {};
        const newProfileData = { ...currentProfile, ...data };
        
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(newProfileData));
        setProfileData(newProfileData); 
        setAvatarPreview(newProfileData.avatarDataUrl); // Ensure preview is also updated if avatar changes
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: newProfileData }));
      } catch (error) {
        console.error("Error al guardar datos del perfil:", error);
        toast({
          title: "Error al Guardar Perfil",
          description: "No se pudieron guardar los datos de tu perfil.",
          variant: "destructive",
        });
      }
    }
  }, [isMounted, toast]);

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    const updatedProfile: ProfileData = {
      ...profileData, 
      name: data.name,
      email: data.email,
      bio: data.bio,
    };
    saveProfileData(updatedProfile);
    toast({
      title: "Perfil Actualizado",
      description: "Tus datos personales han sido guardados.",
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast({
          title: "Archivo Demasiado Grande",
          description: "Por favor, selecciona una imagen de menos de 2MB.",
          variant: "destructive",
        });
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast({
          title: "Tipo de Archivo Inválido",
          description: "Por favor, selecciona un archivo JPEG, PNG, GIF o WebP.",
          variant: "destructive",
        });
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // setAvatarPreview(dataUrl); // This will be set by saveProfileData
        const updatedProfile = { ...profileData, avatarDataUrl: dataUrl };
        saveProfileData(updatedProfile);
        toast({
          title: "Avatar Actualizado",
          description: "Tu foto de perfil ha sido cambiada.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <UserCircle className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCircle className="mr-2 h-6 w-6 text-primary" />
            Foto de Perfil
          </CardTitle>
          <CardDescription>Actualiza tu imagen de perfil (máx. 2MB).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32 cursor-pointer border-2 border-border hover:border-primary transition-colors" onClick={() => fileInputRef.current?.click()}>
            <AvatarImage 
              src={avatarPreview || "https://placehold.co/128x128.png"} 
              alt="Tu Avatar" 
              data-ai-hint="profile photography" />
            <AvatarFallback className="text-4xl">
              {profileData.name ? profileData.name.substring(0, 2).toUpperCase() : 'SA'}
            </AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            id="avatarUpload"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
            <UploadCloud className="mr-2 h-4 w-4" />
            Cambiar Foto
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Save className="mr-2 h-6 w-6 text-primary" />
            Datos Personales
          </CardTitle>
          <CardDescription>Edita tu información personal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="profileName">Nombre Completo</Label>
              <Input id="profileName" {...register('name')} placeholder="Tu nombre" />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="profileEmail">Correo Electrónico</Label>
              <Input id="profileEmail" type="email" {...register('email')} placeholder="tu@correo.com" />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="profileBio">Biografía (Opcional)</Label>
              <Textarea id="profileBio" {...register('bio')} placeholder="Cuéntanos un poco sobre ti..." rows={4} />
              {errors.bio && <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>}
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Guardar Cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
