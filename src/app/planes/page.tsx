
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award } from 'lucide-react'; // Using Award as a placeholder icon

export default function PlanesPage() {
  return (
    <>
      <AppHeader title="Planes y Suscripción" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-6 w-6 text-primary" />
              Nuestros Planes
            </CardTitle>
            <CardDescription>Elige el plan que mejor se adapte a tus necesidades.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detalles sobre los diferentes planes y opciones de suscripción estarán disponibles aquí próximamente.
              Estamos trabajando para ofrecerte las mejores opciones. ¡Gracias por tu paciencia!
            </p>
            {/* Placeholder for future plan listings, e.g., using cards or a table */}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
