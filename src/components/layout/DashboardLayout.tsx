import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../hooks/useAuthStore';
import { LogOut } from 'lucide-react';
import Button from '../ui/Button';

const DashboardLayout = () => {
  const { logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-end bg-white px-8 shadow-sm">
          <Button variant="ghost" onClick={logout} className="text-gray-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
