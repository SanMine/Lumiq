import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut } from 'lucide-react';

interface SettingsPageProps {
  handleLogout: () => void;
}

export default function SettingsPage({ handleLogout }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your dorm profile and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Dorm Profile</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
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
                  defaultValue="Sunshine Dormitory"
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <input
                  type="text"
                  defaultValue="123 University Ave, Campus City"
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  rows={4}
                  defaultValue="Modern student housing with excellent facilities and convenient location near campus."
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Select available amenities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  'Wi-Fi',
                  'Parking',
                  'Laundry',
                  'Gym',
                  'Study Room',
                  'Kitchen',
                  '24/7 Security',
                  'Air Conditioning',
                  'Bike Storage',
                ].map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </label>
                ))}
              </div>
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

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Pricing</CardTitle>
              <CardDescription>Set pricing for different room types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-foreground">Single Room</p>
                  <p className="text-sm text-muted-foreground">Standard single occupancy</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue="450"
                    className="w-24 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">฿/month</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-foreground">Double Room</p>
                  <p className="text-sm text-muted-foreground">Shared room for two students</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue="650"
                    className="w-24 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">฿/month</span>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="font-medium text-foreground">Suite</p>
                  <p className="text-sm text-muted-foreground">Premium suite with private bathroom</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue="1200"
                    className="w-24 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">฿/month</span>
                </div>
              </div>
              <Button>Update Pricing</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'New Booking Requests', desc: 'Get notified when someone books a room' },
                { label: 'Payment Received', desc: 'Notification when payment is completed' },
                { label: 'Review Posted', desc: 'When a guest leaves a review' },
                { label: 'Room Maintenance', desc: 'Updates on maintenance requests' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
