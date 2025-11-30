import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/api";

export default function SecurityTab() {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handlePasswordChange = async () => {
        try {
            // Validation
            if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                toast.error('Please fill in all password fields');
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }

            if (passwordData.newPassword.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }

            setIsUpdatingPassword(true);

            // API Call
            await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            toast.success('Password updated successfully!');

            // Clear form
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error: any) {
            console.error('Password change error:', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <Card className="border-2 border-border">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Update your password to keep your account secure
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        className="bg-muted/50"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        className="bg-muted/50"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        className="bg-muted/50"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                </div>
                <Button
                    onClick={handlePasswordChange}
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
            </CardContent>
        </Card>
    );
}
