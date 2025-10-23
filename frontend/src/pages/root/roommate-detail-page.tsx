import { ArrowLeft, Mail, CheckCircle2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

export default function RoommateDetailPage() {
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
        <section className="py-3 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link to="/roommates" className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Matches</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="bg-[#1a2332] border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    {/* Profile Image */}
                                    <div className="relative mb-6">
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
                                            <img
                                                src={roommate.image}
                                                alt={roommate.name}
                                                className="w-full h-full rounded-full bg-[#2a3544]"
                                            />
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <h2 className="text-2xl font-bold mb-2">{roommate.name}</h2>
                                    <p className="text-gray-400 text-center mb-1">{roommate.university}</p>
                                    <p className="text-gray-400 mb-6">{roommate.year}</p>

                                    {/* Contact Information */}
                                    <div className="w-full">
                                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                                        <div className="bg-[#0f1729] rounded-lg p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm">{roommate.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Preferences */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Matched Preferences */}
                        <Card className="bg-[#1a2332] border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <h3 className="text-xl font-bold">Matched Preferences</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Major */}
                                    <div className="bg-[#0f1729] rounded-lg p-4">
                                        <p className="text-gray-400 text-sm mb-2">Major</p>
                                        <p className="font-semibold">{roommate.matchedPreferences.major}</p>
                                    </div>

                                    {/* Study Habits */}
                                    <div className="bg-[#0f1729] rounded-lg p-4">
                                        <p className="text-gray-400 text-sm mb-2">Study Habits</p>
                                        <p className="font-semibold">{roommate.matchedPreferences.studyHabits}</p>
                                    </div>

                                    {/* Cleanliness */}
                                    <div className="bg-[#0f1729] rounded-lg p-4 md:col-span-2">
                                        <p className="text-gray-400 text-sm mb-2">Cleanliness</p>
                                        <p className="font-semibold">{roommate.matchedPreferences.cleanliness}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Other Preferences */}
                        <Card className="bg-[#1a2332] border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Info className="w-6 h-6 text-yellow-500" />
                                    <h3 className="text-xl font-bold">Other Preferences</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Hobbies */}
                                    <div className="bg-[#0f1729] rounded-lg p-4">
                                        <p className="text-gray-400 text-sm mb-2">Hobbies</p>
                                        <p className="font-semibold">{roommate.otherPreferences.hobbies}</p>
                                    </div>

                                    {/* Social Habits */}
                                    <div className="bg-[#0f1729] rounded-lg p-4">
                                        <p className="text-gray-400 text-sm mb-2">Social Habits</p>
                                        <p className="font-semibold">{roommate.otherPreferences.socialHabits}</p>
                                    </div>

                                    {/* Sleep Schedule */}
                                    <div className="bg-[#0f1729] rounded-lg p-4 md:col-span-2">
                                        <p className="text-gray-400 text-sm mb-2">Sleep Schedule</p>
                                        <p className="font-semibold">{roommate.otherPreferences.sleepSchedule}</p>
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