import z from "zod";

export const NewsLetterFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    })
})

export const SignInFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
})

export const SignUPFormSchema = z
    .object({
        name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters long." })
            .max(50, { message: "Name cannot exceed 50 characters." }),
        email: z.string().email({ message: "Invalid email address." }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long." })
            .max(30, { message: "Password cannot exceed 30 characters." }),
        confirmPassword: z
            .string()
            .min(6, { message: "Confirm Password must be at least 6 characters long." }),
        role: z.enum(["student", "dorm_admin"], {
            required_error: "Please select a role",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });

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
        "Other"
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
    foodPreferences: z.enum([
        "No preference",
        "Vegetarian",
        "Vegan",
        "Halal",
        "Kosher",
    ]),
});