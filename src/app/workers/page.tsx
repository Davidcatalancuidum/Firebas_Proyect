
import WorkerManagementPage from '@/components/WorkerManagementPage';
import AppHeader from '@/components/AppHeader';

export default function WorkersPage() {
  return (
    <>
      <AppHeader title="Gestión de Trabajadores" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <WorkerManagementPage />
      </main>
    </>
  );
}
