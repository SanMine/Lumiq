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

export const RoommateMatchingFormSchema = z.object({
    //* Account Information
    fullName: z.string().min(1, "Full name is required"),
    nickname: z.string().optional(),
    age: z.number().min(16, "Minimum age is 16").max(100, "Maximum age is 100"),
    gender: z.enum(["Male", "Female", "Non-binary", "Prefer not to say"]),
    nationality: z.string().min(1, "Nationality is required"),
    contact: z.string().min(1, "Contact information is required"),
    description: z.string().optional(),

    //* Lifestyle Preferences
    sleepSchedule: z.enum(["Early bird", "Night owl", "Flexible"]),
    lifestyle: z.enum(["Active", "Moderate", "Relaxed"]),
    sleepType: z.enum(["Light sleeper", "Heavy sleeper", "Normal"]),
    studyHabits: z.enum(["Frequent studier", "Moderate studier", "Light studier"]),
    cleanliness: z.enum(["Very tidy", "Moderately tidy", "Not so tidy"]),

    //* Social Preferences
    social: z.enum(["Very social", "Moderately social", "Prefer solitude"]),
    mbti: z.enum([
        "INTJ", "INTP", "ENTJ", "ENTP",
        "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ",
        "ISTP", "ISFP", "ESTP", "ESFP"
    ]).optional(),
    goingOut: z.enum(["Often", "Sometimes", "Rarely"]),

    //* Habits
    smoking: z.enum(["Yes", "No", "Occasionally"]),
    drinking: z.enum(["Yes", "No", "Socially"]),
    pets: z.enum(["Have pets", "Allergic to pets", "No preference"]),

    //* Environmental Preferences
    noiseTolerance: z.enum(["High", "Medium", "Low"]),
    temperature: z.enum(["Prefer warm", "Prefer cool", "No preference"]),
});

type RoommateFormValues = z.infer<typeof RoommateMatchingFormSchema>;

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;
const SLEEP_SCHEDULE = ["Early bird", "Night owl", "Flexible"] as const;
const LIFESTYLE = ["Active", "Moderate", "Relaxed"] as const;
const SLEEP_TYPE = ["Light sleeper", "Heavy sleeper", "Normal"] as const;
const STUDY_HABITS = ["Frequent studier", "Moderate studier", "Light studier"] as const;
const CLEANLINESS = ["Very tidy", "Moderately tidy", "Not so tidy"] as const;
const SOCIAL = ["Very social", "Moderately social", "Prefer solitude"] as const;
const MBTI_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
] as const;
const GOING_OUT = ["Often", "Sometimes", "Rarely"] as const;
const YES_NO_OPTIONS = ["Yes", "No", "Occasionally"] as const;
const DRINKING_OPTIONS = ["Yes", "No", "Socially"] as const;
const PETS_OPTIONS = ["Have pets", "Allergic to pets", "No preference"] as const;
const NOISE_TOLERANCE = ["High", "Medium", "Low"] as const;
const TEMPERATURE = ["Prefer warm", "Prefer cool", "No preference"] as const;

export default function RoommateMatchingPage() {
    const navigate = useNavigate();

    const form = useForm<RoommateFormValues>({
        resolver: zodResolver(RoommateMatchingFormSchema),
        defaultValues: {
            fullName: "",
            nickname: "",
            age: 18,
            nationality: "",
            description: "",
            contact: "",
        },
    });

    const handleSubmit: SubmitHandler<RoommateFormValues> = async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(values);
        navigate('/roommates');
    };

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-lg md:text-xl text-lime-500 font-semibold">{children}</h3>
    );

    const isWorking = form.formState.isSubmitting;

    return (
        <section className="max-w-6xl mx-auto p-6 tracking-wide space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-1">Find Your Perfect Roommate</h1>
                <p className="text-sm text-muted-foreground">
                    Fill out the form below to get matched with compatible roommates.
                </p>
            </div>

            <Card className="rounded-xl shadow-md">
                <CardContent className="">
                    <Form {...form}>
                        <form className="flex flex-col gap-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            {/* Account Information */}
                            <div className="space-y-4">
                                <SectionTitle>Account Information</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-start gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        placeholder="Enter your full name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nickname"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Nickname (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        placeholder="Preferred name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-start gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Age</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={16}
                                                        max={100}
                                                        placeholder="Enter your age"
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
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Gender</FormLabel>
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
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Nationality</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        placeholder="Your nationality"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Contact Information</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isWorking}
                                                    className="min-h-[44px]"
                                                    placeholder="Phone number or Line ID"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>About You (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isWorking}
                                                    className="min-h-[100px] resize-none placeholder:text-sm"
                                                    placeholder="Tell us a bit about yourself, your interests, and what you're looking for in a roommate..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This helps others get to know you better
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Lifestyle Preferences */}
                            <div className="space-y-4">
                                <SectionTitle>Lifestyle Preferences</SectionTitle>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sleepSchedule"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Sleep Schedule</FormLabel>
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
                                                            {SLEEP_SCHEDULE.map((v) => (
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
                                        name="lifestyle"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Lifestyle</FormLabel>
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
                                                            {LIFESTYLE.map((v) => (
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
                                        name="studyHabits"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Study Habits</FormLabel>
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
                                                            {STUDY_HABITS.map((v) => (
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

                            {/* Social Preferences */}
                            <div className="space-y-4">
                                <SectionTitle>Social Preferences</SectionTitle>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="social"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Social Level</FormLabel>
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
                                                            {SOCIAL.map((v) => (
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
                                        name="mbti"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>MBTI (Optional)</FormLabel>
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
                                    <FormField
                                        control={form.control}
                                        name="goingOut"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Going Out</FormLabel>
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
                                                            {GOING_OUT.map((v) => (
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

                            {/* Habits & Preferences */}
                            <div className="space-y-4">
                                <SectionTitle>Habits & Preferences</SectionTitle>
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
                                                        onValueChange={field.onChange}
                                                        value={field.value}
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
                                        name="drinking"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Drinking</FormLabel>
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
                                                            {DRINKING_OPTIONS.map((v) => (
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
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PETS_OPTIONS.map((v) => (
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