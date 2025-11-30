import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Edit, Save } from "lucide-react";

interface PersonalityData {
    nickname: string;
    age: number;
    gender: string;
    nationality: string;
    description: string;
    contact: string;
    sleepSchedule: string;
    lifestyle: string;
    studyHabits: string;
    cleanliness: string;
    social: string;
    mbti: string;
    goingOut: string;
    smoking: boolean;
    drinking: string;
    pets: string;
    noiseTolerance: string;
    temperature: string;
    openForRoommateMatching: boolean;
}

interface PersonalitiesTabProps {
    personalityData: PersonalityData;
    setPersonalityData: (data: PersonalityData) => void;
    isEditingPersonality: boolean;
    setIsEditingPersonality: (editing: boolean) => void;
    isSavingPersonality: boolean;
    handlePersonalitySave: () => Promise<void>;
}

export default function PersonalitiesTab({
    personalityData,
    setPersonalityData,
    isEditingPersonality,
    setIsEditingPersonality,
    isSavingPersonality,
    handlePersonalitySave
}: PersonalitiesTabProps) {
    return (
        <Card className="border-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Personality Profile</CardTitle>
                    <CardDescription>
                        Share your personality and lifestyle preferences
                    </CardDescription>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingPersonality(!isEditingPersonality)}
                >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditingPersonality ? "Cancel" : "Edit"}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                value={personalityData.nickname}
                                onChange={(e) => setPersonalityData({ ...personalityData, nickname: e.target.value })}
                                disabled={!isEditingPersonality}
                                className="bg-muted/50"
                                placeholder="Your preferred name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={personalityData.age}
                                onChange={(e) => setPersonalityData({ ...personalityData, age: parseInt(e.target.value) || 18 })}
                                disabled={!isEditingPersonality}
                                className="bg-muted/50"
                                min="16"
                                max="100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="p-gender">Gender</Label>
                            <Select
                                value={personalityData.gender}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, gender: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="p-nationality">Nationality</Label>
                            <Input
                                id="p-nationality"
                                value={personalityData.nationality}
                                onChange={(e) => setPersonalityData({ ...personalityData, nationality: e.target.value })}
                                disabled={!isEditingPersonality}
                                className="bg-muted/50"
                                placeholder="Your nationality"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="p-contact">Contact</Label>
                        <Input
                            id="p-contact"
                            value={personalityData.contact}
                            onChange={(e) => setPersonalityData({ ...personalityData, contact: e.target.value })}
                            disabled={!isEditingPersonality}
                            className="bg-muted/50"
                            placeholder="Phone or email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="p-description">Description</Label>
                        <Input
                            id="p-description"
                            value={personalityData.description}
                            onChange={(e) => setPersonalityData({ ...personalityData, description: e.target.value })}
                            disabled={!isEditingPersonality}
                            className="bg-muted/50"
                            placeholder="Tell us about yourself"
                        />
                    </div>
                </div>

                {/* Lifestyle Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Lifestyle Preferences</h3>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
                            <Select
                                value={personalityData.sleepSchedule}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, sleepSchedule: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Early Bird">Early Bird</SelectItem>
                                    <SelectItem value="Night Owl">Night Owl</SelectItem>
                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lifestyle">Lifestyle</Label>
                            <Select
                                value={personalityData.lifestyle}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, lifestyle: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Relaxed">Relaxed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studyHabits">Study Habits</Label>
                            <Select
                                value={personalityData.studyHabits}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, studyHabits: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="silent">Silent</SelectItem>
                                    <SelectItem value="some_noise">Some Noise</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cleanliness">Cleanliness</Label>
                            <Select
                                value={personalityData.cleanliness}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, cleanliness: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tidy">Tidy</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Messy">Messy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Social Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Social Preferences</h3>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="social">Social Level</Label>
                            <Select
                                value={personalityData.social}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, social: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Social">Social</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Quiet">Quiet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mbti">MBTI (Optional)</Label>
                            <Select
                                value={personalityData.mbti}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, mbti: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue placeholder="Select MBTI" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INTJ">INTJ</SelectItem>
                                    <SelectItem value="INTP">INTP</SelectItem>
                                    <SelectItem value="ENTJ">ENTJ</SelectItem>
                                    <SelectItem value="ENTP">ENTP</SelectItem>
                                    <SelectItem value="INFJ">INFJ</SelectItem>
                                    <SelectItem value="INFP">INFP</SelectItem>
                                    <SelectItem value="ENFJ">ENFJ</SelectItem>
                                    <SelectItem value="ENFP">ENFP</SelectItem>
                                    <SelectItem value="ISTJ">ISTJ</SelectItem>
                                    <SelectItem value="ISFJ">ISFJ</SelectItem>
                                    <SelectItem value="ESTJ">ESTJ</SelectItem>
                                    <SelectItem value="ESFJ">ESFJ</SelectItem>
                                    <SelectItem value="ISTP">ISTP</SelectItem>
                                    <SelectItem value="ISFP">ISFP</SelectItem>
                                    <SelectItem value="ESTP">ESTP</SelectItem>
                                    <SelectItem value="ESFP">ESFP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="goingOut">Going Out</Label>
                            <Select
                                value={personalityData.goingOut}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, goingOut: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Frequent">Frequent</SelectItem>
                                    <SelectItem value="Occasional">Occasional</SelectItem>
                                    <SelectItem value="Homebody">Homebody</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Habits */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Habits</h3>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="smoking">Smoking</Label>
                            <Select
                                value={personalityData.smoking ? "Yes" : "No"}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, smoking: value === "Yes" })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="drinking">Drinking</Label>
                            <Select
                                value={personalityData.drinking}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, drinking: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Never">Never</SelectItem>
                                    <SelectItem value="Occasional">Occasional</SelectItem>
                                    <SelectItem value="Frequent">Frequent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pets">Pets</Label>
                            <Select
                                value={personalityData.pets}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, pets: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pet Owner">Pet Owner</SelectItem>
                                    <SelectItem value="Allergic">Allergic</SelectItem>
                                    <SelectItem value="Dog Person">Dog Person</SelectItem>
                                    <SelectItem value="Cat Person">Cat Person</SelectItem>
                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Environmental Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Environmental Preferences</h3>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="noiseTolerance">Noise Tolerance</Label>
                            <Select
                                value={personalityData.noiseTolerance}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, noiseTolerance: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature Preference</Label>
                            <Select
                                value={personalityData.temperature}
                                onValueChange={(value) => setPersonalityData({ ...personalityData, temperature: value })}
                                disabled={!isEditingPersonality}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Warm">Warm</SelectItem>
                                    <SelectItem value="Cool">Cool</SelectItem>
                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Roommate Matching Availability */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Roommate Matching</h3>
                    <Separator />
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="space-y-1">
                            <Label htmlFor="openForRoommateMatching" className="text-base font-medium cursor-pointer">
                                Open for Roommate Matching
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Allow others to see your profile in roommate search results
                            </p>
                        </div>
                        <Switch
                            id="openForRoommateMatching"
                            checked={personalityData.openForRoommateMatching}
                            onCheckedChange={(checked) =>
                                setPersonalityData({ ...personalityData, openForRoommateMatching: checked })
                            }
                            disabled={!isEditingPersonality}
                        />
                    </div>
                </div>

                {isEditingPersonality && (
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditingPersonality(false)}
                            disabled={isSavingPersonality}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePersonalitySave}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            disabled={isSavingPersonality}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSavingPersonality ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
