import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Calendar, LogOut, MapPin, Phone, Users } from "lucide-react";

interface ProfileData {
    phone: string;
    address: string;
    dateOfBirth: string;
}

interface ProfileCardProps {
    user: any; // Using any to accept the User type from AuthContext
    profileData: ProfileData;
    userInitials: string;
    onLogout: () => void;
    onNavigateRoommates: () => void;
}

export default function ProfileCard({
    user,
    profileData,
    userInitials,
    onLogout,
    onNavigateRoommates
}: ProfileCardProps) {
    return (
        <Card className="border-2 border-border sticky top-6">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    {/* Avatar with upload button */}
                    <div className="relative mb-4">
                        <Avatar className="w-32 h-32 border-4 border-border">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                            <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
                        >
                            <Camera className="w-4 h-4" />
                        </Button>
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-1">
                        {user.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-3">
                        {user.email}
                    </p>

                    <Badge className="mb-4 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                        {user.role === 'student' ? 'Student' : user.role === 'admin' ? 'Admin' : 'Owner'}
                    </Badge>

                    <Separator className="my-4" />

                    <div className="w-full space-y-3 text-left">
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{profileData.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground line-clamp-2">{profileData.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{profileData.dateOfBirth}</span>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <Button
                        variant="outline"
                        className="w-full mb-3"
                        onClick={onNavigateRoommates}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        My Roommates
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
