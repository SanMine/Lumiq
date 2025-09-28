import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { LuMoveRight } from "react-icons/lu";
import Spinner from "@/components/shared/spinner";

export const RoommateMatchingFormSchema = z.object({
    //* Basic Info
    fullName: z.string().min(1, "Full name is required"),
    age: z.number().min(16, "Minimum age is 16"),
    major: z.enum([
        "Computer Science",
        "Software Engineering",
        "Business Administration",
        "Psychology",
        "Biology",
        "Other",
    ]),

    //* Lifestyle Preferences
    sleepSchedule: z.enum(["Early bird", "Night owl"]),
    noiseLevel: z.enum(["Prefer quiet", "Okay with noise"]),
    cleanliness: z.enum(["Very tidy", "Moderately tidy", "Not so tidy"]),

    //* Social Preferences
    personality: z.enum(["Introvert", "Extrovert", "Ambivert"]),
    sharingHabits: z.enum(["Happy to share", "Prefer personal space"]),
    communicationStyle: z.enum(["Direct and open", "Indirect", "Neutral"]),

    //* Room Preferences
    roomType: z.enum(["Single", "Shared"]),
    bedPreference: z.enum(["Upper bunk", "Lower bunk", "No preference"]),
    durationOfStay: z.enum(["1 semester", "2 semesters", "Full year"]),

    //* Specific Details
    religion: z.string().optional(),
    foodPreferences: z.enum(["No preference", "Vegetarian", "Vegan", "Halal", "Kosher"]),
});
type RoommateFormValues = z.infer<typeof RoommateMatchingFormSchema>;

const MAJORS = [
    "Computer Science",
    "Software Engineering",
    "Business Administration",
    "Psychology",
    "Biology",
    "Other",
] as const;

const SLEEP = ["Early bird", "Night owl"] as const;
const NOISE = ["Prefer quiet", "Okay with noise"] as const;
const CLEAN = ["Very tidy", "Moderately tidy", "Not so tidy"] as const;

const PERSONALITY = ["Introvert", "Extrovert", "Ambivert"] as const;
const SHARING = ["Happy to share", "Prefer personal space"] as const;
const COMM_STYLE = ["Direct and open", "Indirect", "Neutral"] as const;

const ROOM_TYPE = ["Single", "Shared"] as const;
const BED_PREF = ["Upper bunk", "Lower bunk", "No preference"] as const;
const DURATION = ["1 semester", "2 semesters", "Full year"] as const;

const FOOD = ["No preference", "Vegetarian", "Vegan", "Halal", "Kosher"] as const;

export default function RoommateMatchingPage() {
    const form = useForm<RoommateFormValues>({
        resolver: zodResolver(RoommateMatchingFormSchema),
        defaultValues: {
            fullName: "",
            age: 18,
        },
        mode: "onTouched",
    });

    const handleSubmit: SubmitHandler<RoommateFormValues> = async (values) => {
        console.log(values);
    };

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-lg md:text-xl text-lime-500 font-semibold">{children}</h3>
    );

    const isWorking = form.formState.isSubmitting;

    return (
        <section className="max-w-5xl mx-auto p-6 tracking-wide space-y-6">
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
                            <div className="space-y-4">
                                <SectionTitle>Basic Info</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isWorking} className="min-h-[44px]" placeholder="Enter your full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Age</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isWorking}
                                                        className="min-h-[44px]"
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={16}
                                                        placeholder="Enter your age"
                                                        value={Number.isNaN(field.value as number) ? "" : field.value}
                                                        onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="major"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Major</FormLabel>
                                            <FormControl>
                                                <Select
                                                    disabled={isWorking}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-full min-h-[44px]">
                                                        <SelectValue placeholder="Select your major" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {MAJORS.map((m) => (
                                                            <SelectItem key={m} value={m}>
                                                                {m}
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
                            <div className="space-y-4">
                                <SectionTitle>Lifestyle Preferences</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="sleepSchedule"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Sleep Schedule</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SLEEP.map((v) => (
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
                                        name="noiseLevel"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Noise Level</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {NOISE.map((v) => (
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
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Cleanliness</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CLEAN.map((v) => (
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
                            <div className="space-y-4">
                                <SectionTitle>Social Preferences</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="personality"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Personality</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PERSONALITY.map((v) => (
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
                                        name="sharingHabits"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Sharing Habits</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SHARING.map((v) => (
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
                                        name="communicationStyle"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Communication Style</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {COMM_STYLE.map((v) => (
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
                            <div className="space-y-4">
                                <SectionTitle>Room Preferences</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="roomType"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Room Type</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ROOM_TYPE.map((v) => (
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
                                        name="bedPreference"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Bed Preference</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {BED_PREF.map((v) => (
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
                                        name="durationOfStay"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/3">
                                                <FormLabel>Duration of Stay</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {DURATION.map((v) => (
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

                            <div className="space-y-4">
                                <SectionTitle>Specific Details</SectionTitle>
                                <Separator />
                                <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="religion"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Religion (optional)</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isWorking} className="min-h-[44px]" placeholder="Your religion" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="foodPreferences"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2">
                                                <FormLabel>Food Preferences</FormLabel>
                                                <FormControl>
                                                    <Select disabled={isWorking} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full min-h-[44px]">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {FOOD.map((v) => (
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
                                <Button type="submit" size="lg" className="rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[40px] text-white cursor-pointer">
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