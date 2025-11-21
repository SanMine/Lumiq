import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { LayoutDashboard, Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/shared/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import separate page components
import AdminSidebar from '@/admin-pages/AdminSidebar';
import OverviewPage from '@/admin-pages/OverviewPage';
import MyDormPage from '@/admin-pages/MyDormPage';
import RoomsPage from '@/admin-pages/RoomsPage';
import BookingsPage from '@/admin-pages/BookingsPage';
import AnalyticsPage from '@/admin-pages/AnalyticsPage';
import SettingsPage from '@/admin-pages/SettingsPage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/auth/signin');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token || !user?._id) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserData(user);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, user?._id, user]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Component */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        userData={userData}
        user={user}
        loading={loading}
      />

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 hover:bg-accent"
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Theme Toggle Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="relative rounded-full p-2 hover:bg-accent">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive"></span>
          </button>
        </header>

        {/* Dashboard Content - Render based on active tab */}
        <main className="p-6">
          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'dorms' && <MyDormPage token={token} />}
          {activeTab === 'rooms' && <RoomsPage token={token} />}
          {activeTab === 'bookings' && <BookingsPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'settings' && <SettingsPage handleLogout={handleLogout} />}
        </main>
      </div>
    </div>
  );
}