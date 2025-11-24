import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Check, X } from 'lucide-react';
import api from '@/api';
import Loader from '@/components/shared/loader';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsPageProps {
  handleLogout: () => void;
}

interface NotificationPreferences {
  newBookings: boolean;
  paymentReceived: boolean;
  reviewPosted: boolean;
  roomMaintenance: boolean;
}

interface DormData {
  _id: number;
  name: string;
  address: string;
  description?: string;
}

export default function SettingsPage({ handleLogout }: SettingsPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newBookings: true,
    paymentReceived: true,
    reviewPosted: true,
    roomMaintenance: true,
  });
  const [dormData, setDormData] = useState<DormData | null>(null);
  const [dormName, setDormName] = useState('');
  const [dormAddress, setDormAddress] = useState('');
  const [dormDescription, setDormDescription] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dorm data if user has a dormId
      if (user?.dormId) {
        const dormResponse = await api.get(`/dorms/${user.dormId}`);
        setDormData(dormResponse.data);
        setDormName(dormResponse.data.name || '');
        setDormAddress(dormResponse.data.address || '');
        setDormDescription(dormResponse.data.description || '');
      }

      // Note: /user-settings endpoint doesn't exist yet
      // For now, we'll just use default preferences
      // In the future, add: const response = await api.get('/user-settings');
      // setPreferences(response.data.notificationPreferences);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.response?.data?.error || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveDormChanges = async () => {
    try {
      if (!user?.dormId) {
        setError('No dorm associated with this account');
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      await api.put(`/dorms/${user.dormId}`, {
        name: dormName,
        address: dormAddress,
        description: dormDescription,
      });

      setSuccess('Dorm information updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating dorm:', err);
      setError(err.response?.data?.error || 'Failed to update dorm information');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Optimistic update
      setPreferences(prev => ({ ...prev, [key]: value }));

      // Note: /user-settings/notifications endpoint doesn't exist yet
      // For now, just update local state
      // In the future, add: const response = await api.put('/user-settings/notifications', {...});

      setSuccess('Preference updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating preference:', err);
      setError(err.response?.data?.error || 'Failed to update preference');

      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your dorm profile and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="rounded-lg bg-chart-2/10 border border-chart-2 p-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-chart-2" />
          <p className="text-sm text-chart-2 font-medium">{success}</p>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive p-4 flex items-center gap-2">
          <X className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Dorm Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dorm Information</CardTitle>
              <CardDescription>
                Update your dorm details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dorm Name</label>
                <input
                  type="text"
                  value={dormName}
                  onChange={(e) => setDormName(e.target.value)}
                  placeholder="Enter dorm name"
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <input
                  type="text"
                  value={dormAddress}
                  onChange={(e) => setDormAddress(e.target.value)}
                  placeholder="Enter dorm address"
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  rows={4}
                  value={dormDescription}
                  onChange={(e) => setDormDescription(e.target.value)}
                  placeholder="Enter dorm description"
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button onClick={saveDormChanges} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Account</CardTitle>
              <CardDescription>
                Manage your account settings and logout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-destructive/10 p-4">
                <p className="text-sm text-foreground mb-3">
                  Log out from your account. You'll be redirected to the login page.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and control feature access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'newBookings' as keyof NotificationPreferences,
                  label: 'New Booking Requests',
                  desc: 'Get notified when someone books a room'
                },
                {
                  key: 'paymentReceived' as keyof NotificationPreferences,
                  label: 'Payment Received',
                  desc: 'Notification when payment is completed'
                },
                {
                  key: 'reviewPosted' as keyof NotificationPreferences,
                  label: 'Review Posted',
                  desc: 'When a guest leaves a review (disabling this will disable review functionality)'
                },
                {
                  key: 'roomMaintenance' as keyof NotificationPreferences,
                  label: 'Room Maintenance',
                  desc: 'Updates on maintenance requests'
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[item.key]}
                      onChange={(e) => updatePreference(item.key, e.target.checked)}
                      disabled={saving}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-chart-2"></div>
                  </label>
                </div>
              ))}

              {!preferences.reviewPosted && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/50 p-4 mt-4">
                  <p className="text-sm text-destructive font-medium mb-1">
                    Review Functionality Disabled
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Review posting and viewing is currently disabled. Enable "Review Posted" to allow users to post and view reviews on your dorm.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
