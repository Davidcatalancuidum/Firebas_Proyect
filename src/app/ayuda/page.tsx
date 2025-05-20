
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export default function AyudaPage() {
  return (
    <>
      <AppHeader title="Ayuda" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-6 w-6 text-primary" />
              Centro de Ayuda
            </CardTitle>
            <CardDescription>Encuentra respuestas a tus preguntas y aprende a usar Día Maestro.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-2">Preguntas Frecuentes</h2>
              <p className="text-muted-foreground">
                Aquí encontrarás una lista de preguntas frecuentes. Esta sección está en construcción.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">Tutoriales</h2>
              <p className="text-muted-foreground">
                Videos y guías paso a paso para aprovechar al máximo la aplicación. Contenido próximamente.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">Contactar a Soporte</h2>
              <p className="text-muted-foreground">
                Si no encuentras lo que buscas, contáctanos. Detalles de contacto estarán disponibles pronto.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
