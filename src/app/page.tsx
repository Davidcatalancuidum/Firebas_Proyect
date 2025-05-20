import DiaMaestroPage from '@/components/DiaMaestroPage';
import AppHeader from '@/components/AppHeader';

export default function Home() {
  return (
    <>
      <AppHeader title="Panel de Tareas" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <DiaMaestroPage />
      </main>
    </>
  );
}
