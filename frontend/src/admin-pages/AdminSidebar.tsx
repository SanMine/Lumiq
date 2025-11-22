import React from 'react';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Calendar,
  BarChart3,
  Settings,
  User,
  MapPin,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  userData: any;
  user: any;
  loading: boolean;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  userData,
  user,
  loading,
}: AdminSidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r bg-sidebar w-64`}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Building2 className="h-6 w-6 text-sidebar-primary" />
          <span className="ml-3 text-lg font-semibold text-sidebar-foreground">LUMIQ Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('dorms')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'dorms'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Building2 className="h-5 w-5" />
            My Dorm
          </button>

          {/* New Location tab */}
          <button
            onClick={() => setActiveTab('location')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'location'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <MapPin className="h-5 w-5" />
            Location
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'rooms'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <BedDouble className="h-5 w-5" />
            Rooms
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Calendar className="h-5 w-5" />
            Bookings
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>

        {/* User Profile */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                {loading ? 'Loading...' : (userData?.name || user?.name || 'Admin User')}
              </p>
              <p className="text-xs text-muted-foreground">
                {userData?.email || user?.email || 'admin@lumiq.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}