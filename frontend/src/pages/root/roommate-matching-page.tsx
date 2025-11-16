import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { LuMoveRight } from "react-icons/lu";
import Spinner from "@/components/shared/spinner";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import api from "@/api";
import { useEffect } from "react";

export const RoommateMatchingFormSchema = z.object({
    //* Preferred Roommate Age Range
    ageMin: z.number().min(16, "Minimum age is 16").max(100, "Maximum age is 100"),
    ageMax: z.number().min(16, "Minimum age is 16").max(100, "Maximum age is 100"),

    //* Preferred Basic Information
    gender: z.enum(["Male", "Female", "Non-Binary", "Trans Male", "Trans Female", "Agender", "Genderqueer", "Any"]),
    nationality: z.string().optional(),

    //* Preferred Lifestyle
    sleepType: z.enum(["Early Bird", "Night Owl", "Any"]),
    cleanliness: z.enum(["Tidy", "Moderate", "Messy"]),

    //* Preferred Social & Personality
    mbti: z.enum([
        "INTJ", "INTP", "ENTJ", "ENTP",
        "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ",
        "ISTP", "ISFP", "ESTP", "ESFP", "Any"
    ]),

    //* Preferred Habits
    smoking: z.boolean(),
    pets: z.boolean(),

    //* Preferred Environmental
    noiseTolerance: z.enum(["Low", "Medium", "High", "Flexible"]),
    temperature: z.enum(["Cold", "Cool", "Warm", "Hot", "Flexible"]),

    //* Additional Preferences
    additionalPreferences: z.string().optional(),
});

type RoommateFormValues = z.infer<typeof RoommateMatchingFormSchema>;

const GENDER_OPTIONS = ["Male", "Female", "Non-Binary", "Trans Male", "Trans Female", "Agender", "Genderqueer", "Any"] as const;
const SLEEP_TYPE = ["Early Bird", "Night Owl", "Any"] as const;
const CLEANLINESS = ["Tidy", "Moderate", "Messy"] as const;
const MBTI_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP", "Any"
] as const;
const YES_NO_OPTIONS = ["Yes", "No"] as const;
const NOISE_TOLERANCE = ["Low", "Medium", "High", "Flexible"] as const;
const TEMPERATURE = ["Cold", "Cool", "Warm", "Hot", "Flexible"] as const;

export default function RoommateMatchingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const form = useForm<RoommateFormValues>({
        resolver: zodResolver(RoommateMatchingFormSchema),
        defaultValues: {
            ageMin: 18,
            ageMax: 30,
            gender: "Any",
            nationality: "",
            sleepType: "Any",
            cleanliness: "Moderate",
            mbti: "Any",
            smoking: false,
            pets: false,
            noiseTolerance: "Medium",
            temperature: "Flexible",
            additionalPreferences: "",
        },
    });

    // Fetch existing preferred roommate data if available
    useEffect(() => {
        const fetchPreferredRoommate = async () => {
            if (!user) return;
            
            try {
                const response = await api.get(`/preferred_roommate?userId=${user._id || user.id}`);
                const pref = response.data;
                
                // Map backend data to frontend form
                form.reset({
                    ageMin: pref.preferred_age_range?.min || 18,
                    ageMax: pref.preferred_age_range?.max || 30,
                    gender: pref.preferred_gender || "Any",
                    nationality: pref.preferred_nationality || "",
                    sleepType: pref.preferred_sleep_type || "Any",
                    cleanliness: pref.preferred_cleanliness || "Moderate",
                    mbti: pref.preferred_MBTI || "Any",
                    smoking: pref.preferred_smoking || false,
                    pets: pref.preferred_pets || false,
                    noiseTolerance: pref.preferred_noise_tolerance || "Medium",
                    temperature: pref.preferred_temperature || "Flexible",
                    additionalPreferences: pref.additional_preferences || "",
                });
            } catch (error: any) {
                // No existing preferred roommate data, use defaults
                console.log("No existing preferred roommate data");
            }
        };
        
        fetchPreferredRoommate();
    }, [user, form]);

    const handleSubmit: SubmitHandler<RoommateFormValues> = async (values) => {
        if (!user) {
            toast.error("Please login to save your roommate preferences");
            navigate("/auth/sign-in");
            return;
        }

        try {
            // Map frontend form data to backend schema
            const preferredRoommateData = {
                userId: user._id || user.id,
                preferred_age_range: {
                    min: values.ageMin,
                    max: values.ageMax,
                },
                preferred_gender: values.gender,
                preferred_nationality: values.nationality || null,
                preferred_sleep_type: values.sleepType,
                preferred_cleanliness: values.cleanliness,
                preferred_MBTI: values.mbti,
                preferred_smoking: values.smoking,
                preferred_pets: values.pets,
                preferred_noise_tolerance: values.noiseTolerance,
                preferred_temperature: values.temperature,
                additional_preferences: values.additionalPreferences || null,
            };

            // Check if preferences already exist
            try {
                const existingResponse = await api.get(`/preferred_roommate?userId=${user._id || user.id}`);
                // Update existing preferences
                await api.put(`/preferred_roommate/${existingResponse.data._id}`, preferredRoommateData);
                toast.success("Roommate preferences updated successfully!");
            } catch (error: any) {
                // Create new preferences
                await api.post("/preferred_roommate", preferredRoommateData);
                toast.success("Roommate preferences saved successfully!");
            }

            navigate('/roommates');
        } catch (error: any) {
            console.error("Error saving preferences:", error);
            toast.error(error.response?.data?.error || "Failed to save roommate preferences");
        }
    };

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-lg md:text-xl text-lime-500 font-semibold">{children}</h3>
    );

    const isWorking = form.formState.isSubmitting;

    return (
        <section className="max-w-6xl mx-auto p-6 tracking-wide space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-1">Set Your Roommate Preferences</h1>
                <p className="text-sm text-muted-foreground">
                    Tell us what you're looking for in a roommate to get matched with compatible people.
                </p>
            </div>

            <Card className="rounded-xl shadow-md">
                <CardContent className="">
                    <Form {...form}>
                        <form className="flex flex-col gap-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            {/* Preferred Age Range */}
                            <div className="space-y-4">
                                <SectionTitle>Preferred Age Range</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-start gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="ageMin"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Minimum Age</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={16}
                                                        max={100}
                                                        placeholder="Minimum age"
                                                        value={Number.isNaN(field.value as number) ? "" : field.value}
                                                        onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ageMax"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Maximum Age</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={16}
                                                        max={100}
                                                        placeholder="Maximum age"
                                                        value={Number.isNaN(field.value as number) ? "" : field.value}
                                                        onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Preferred Basic Information */}
                            <div className="space-y-4">
                                <SectionTitle>Preferred Basic Information</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-start gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Preferred Gender</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {GENDER_OPTIONS.map((option) => (
                                                                <SelectItem key={option} value={option}>
                                                                    {option}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nationality"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Preferred Nationality (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        placeholder="Any nationality"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Preferred Lifestyle */}
                            <div className="space-y-4">
                                <SectionTitle>Preferred Lifestyle</SectionTitle>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sleepType"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Sleep Type</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SLEEP_TYPE.map((v) => (
                                                                <SelectItem key={v} value={v}>
                                                                    {v}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cleanliness"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Cleanliness</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CLEANLINESS.map((v) => (
                                                                <SelectItem key={v} value={v}>
                                                                    {v}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Preferred Personality */}
                            <div className="space-y-4">
                                <SectionTitle>Preferred Personality</SectionTitle>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="mbti"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>MBTI</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select MBTI" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {MBTI_TYPES.map((v) => (
                                                                <SelectItem key={v} value={v}>
                                                                    {v}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Preferred Habits */}
                            <div className="space-y-4">
                                <SectionTitle>Preferred Habits</SectionTitle>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="smoking"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Smoking</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={(value) => field.onChange(value === "Yes")}
                                                        value={field.value ? "Yes" : "No"}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {YES_NO_OPTIONS.map((v) => (
                                                                <SelectItem key={v} value={v}>
                                                                    {v}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pets"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Pets</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={(value) => field.onChange(value === "Yes")}
                                                        value={field.value ? "Yes" : "No"}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {YES_NO_OPTIONS.map((v) => (
                                                                <SelectItem key={v} value={v}>
                                                                    {v}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Environmental Preferences */}
                            <div className="space-y-4">
                                <SectionTitle>Environmental Preferences</SectionTitle>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="noiseTolerance"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Noise Tolerance</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {NOISE_TOLERANCE.map((v) => (
                                                                <SelectItem key={v} value={v}>
                                                                    {v}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="temperature"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Temperature Preference</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={isWorking}
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TEMPERATURE.map((v) => (
                                                                <SelectItem key={v} value={v}>
                                                                    {v}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer"
                                >
                                    <Spinner isLoading={isWorking} label="Finding your match...">
                                        Find My Match <LuMoveRight className="ml-1 size-5" />
                                    </Spinner>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}