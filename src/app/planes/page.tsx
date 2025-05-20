
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, Star, Zap } from 'lucide-react'; 

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
}

const plans: Plan[] = [
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
    buttonText: 'Comenzar con Basico',
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
  },
  {
    id: 'pro',
    icon: Zap,
    title: 'Pro',
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
    buttonText: 'Pasar a Pro',
  },
];

export default function PlanesPage() {
  return (
    <>
      <AppHeader title="Planes y Suscripción" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Elige el Plan Perfecto para Ti
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Desde tareas individuales hasta la gestión completa de equipos, tenemos un plan que se adapta a tus necesidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`flex flex-col ${plan.highlight ? 'border-primary shadow-primary/20 shadow-lg' : 'shadow-md'}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl font-semibold flex items-center">
                    <plan.icon className={`mr-2 h-7 w-7 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    {plan.title}
                  </CardTitle>
                  {plan.highlight && (
                     <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Popular</span>
                  )}
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-muted-foreground">{plan.priceDetails}</span>
                </div>
                <CardDescription className="pt-2 text-sm min-h-[40px]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle 
                        className={`h-4 w-4 mr-2 flex-shrink-0 ${feature.included ? 'text-primary' : 'text-muted-foreground/50'}`} 
                      />
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/70 line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button 
                  className="w-full text-base py-3" 
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            ¿Tienes preguntas? <a href="/ayuda" className="text-primary hover:underline">Visita nuestro centro de ayuda</a> o contáctanos.
          </p>
        </div>
      </main>
    </>
  );
}
