
import ProfilePage from '@/components/ProfilePage';
import AppHeader from '@/components/AppHeader';

export default function PerfilRoute() {
  return (
    <>
      <AppHeader title="Mi Perfil" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <ProfilePage />
      </main>
    </>
  );
}
