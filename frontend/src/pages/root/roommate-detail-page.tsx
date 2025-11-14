import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Info, Mail } from "lucide-react";
import { useNavigate } from "react-router";

export default function RoommateDetailPage() {
    const navigate = useNavigate();

    const roommate = {
        name: "Sophia Clark",
        university: "University of California, Los Angeles",
        year: "Sophomore",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
        email: "sophia.clark@email.com",
        matchedPreferences: {
            major: "Computer Science",
            studyHabits: "Focused, prefers quiet study environment",
            cleanliness: "Very tidy, prefers a clean living space"
        },
        otherPreferences: {
            hobbies: "Hiking, coding, reading",
            socialHabits: "Enjoys occasional social gatherings",
            sleepSchedule: "Early riser, goes to bed around 10 PM"
        }
    };

    return (
        <section className="min-h-screen bg-background py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button - Fixed width */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/roommates")}
                    className="w-fit mb-6 sm:mb-8 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Matches
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="border-2 border-border bg-card shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    {/* Profile Image */}
                                    <div className="relative mb-6">
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1 shadow-xl">
                                            <img
                                                src={roommate.image}
                                                alt={roommate.name}
                                                className="w-full h-full rounded-full bg-muted"
                                            />
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <h2 className="text-2xl font-bold mb-2 text-foreground text-center">
                                        {roommate.name}
                                    </h2>
                                    <p className="text-muted-foreground text-center mb-1 text-sm">
                                        {roommate.university}
                                    </p>
                                    <Badge variant="secondary" className="mb-6">
                                        {roommate.year}
                                    </Badge>

                                    {/* Contact Information */}
                                    <div className="w-full">
                                        <h3 className="text-lg font-semibold mb-4 text-foreground">
                                            Contact Information
                                        </h3>
                                        <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center gap-3 hover:bg-muted transition-colors">
                                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                                <Mail className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm text-foreground break-all">
                                                {roommate.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Preferences */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Matched Preferences */}
                        <Card className="border-2 border-border bg-card shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        Matched Preferences
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Major */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Major
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {roommate.matchedPreferences.major}
                                        </p>
                                    </div>

                                    {/* Study Habits */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Study Habits
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {roommate.matchedPreferences.studyHabits}
                                        </p>
                                    </div>

                                    {/* Cleanliness */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 md:col-span-2 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Cleanliness
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {roommate.matchedPreferences.cleanliness}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Other Preferences */}
                        <Card className="border-2 border-border bg-card shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                                        <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        Other Preferences
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Hobbies */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Hobbies
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {roommate.otherPreferences.hobbies}
                                        </p>
                                    </div>

                                    {/* Social Habits */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Social Habits
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {roommate.otherPreferences.socialHabits}
                                        </p>
                                    </div>

                                    {/* Sleep Schedule */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 md:col-span-2 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Sleep Schedule
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {roommate.otherPreferences.sleepSchedule}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}