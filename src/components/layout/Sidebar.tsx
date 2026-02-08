import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  Music,
  BarChart3,
  Settings,
  Users,
  Database,
  DollarSign,
  FileText,
  Upload
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'user';

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'operator', 'user'],
    },
    {
      title: 'New Release',
      path: '/releases/new',
      icon: PlusCircle,
      roles: ['user'],
    },
    {
      title: 'All Release',
      path: '/releases',
      icon: Music,
      roles: ['admin', 'operator', 'user'],
    },
  ];

  const reportItems = [
    {
      title: 'Statistik',
      path: '/reports/statistics',
      icon: BarChart3,
      roles: ['admin', 'operator', 'user'],
    },
    {
      title: 'Revenue',
      path: '/reports/revenue',
      icon: DollarSign,
      roles: ['admin', 'operator', 'user'],
    },
    {
      title: 'Payment',
      path: '/reports/payment',
      icon: FileText,
      roles: ['admin', 'operator', 'user'],
    },
    {
      title: 'Upload Laporan',
      path: '/reports/upload',
      icon: Upload,
      roles: ['admin'],
    },
  ];

  const settingItems = [
    {
      title: 'Aggregators',
      path: '/settings/aggregators',
      icon: Database,
      roles: ['admin'],
    },
    {
      title: 'Users',
      path: '/settings/users',
      icon: Users,
      roles: ['admin'],
    },
  ];

  const filterItems = (items: any[]) => {
    return items.filter((item) => item.roles.includes(role));
  };

  const renderNavItems = (items: any[]) => {
    const filtered = filterItems(items);
    if (filtered.length === 0) return null;

    return (
      <nav className="space-y-1 px-2">
        {filtered.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
              )}
              aria-hidden="true"
            />
            {item.title}
          </NavLink>
        ))}
      </nav>
    );
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center px-4 border-b">
        <Music className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold text-gray-900">MusicCMS</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          <div>
            <div className="px-4 mb-2 text-xs font-semibold uppercase text-gray-400">
              Menu
            </div>
            {renderNavItems(menuItems)}
          </div>
          
          <div>
            <div className="px-4 mb-2 text-xs font-semibold uppercase text-gray-400">
              Data Laporan
            </div>
            {renderNavItems(reportItems)}
          </div>

          {(role === 'admin') && (
            <div>
              <div className="px-4 mb-2 text-xs font-semibold uppercase text-gray-400">
                Settings
              </div>
              {renderNavItems(settingItems)}
            </div>
          )}
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
