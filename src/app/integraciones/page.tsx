
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react'; // Using Settings as a placeholder icon

export default function IntegracionesPage() {
  return (
    <>
      <AppHeader title="Integraciones" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-6 w-6 text-primary" />
              Integraciones Disponibles
            </CardTitle>
            <CardDescription>Conecta Día Maestro con tus herramientas favoritas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Actualmente no hay integraciones disponibles. Estamos trabajando para añadir compatibilidad con otras aplicaciones.
              ¡Vuelve pronto para ver las novedades!
            </p>
            {/* Placeholder for future integration listings */}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
