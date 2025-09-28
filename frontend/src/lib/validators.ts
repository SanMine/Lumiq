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
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(30, { message: "Password cannot exceed 30 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        }),
})

export const SignUPFormSchema = z
    .object({
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters long." })
            .max(30, { message: "Username cannot exceed 30 characters." })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message: "Username can only contain letters, numbers, and underscores.",
            }),
        // name: z
        //     .string()
        //     .min(1, { message: "Name is required." })
        //     .max(50, { message: "Name cannot exceed 50 characters." })
        //     .regex(/^[a-zA-Z\s]+$/, {
        //         message: "Name can only contain letters and spaces.",
        //     }),
        email: z.string().email({ message: "Invalid email address." }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long." })
            .max(30, { message: "Password cannot exceed 30 characters." })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter.",
            })
            .regex(/[a-z]/, {
                message: "Password must contain at least one lowercase letter.",
            })
            .regex(/[0-9]/, { message: "Password must contain at least one number." })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Password must contain at least one special character.",
            }),
        confirmPassword: z
            .string()
            .min(8, { message: "Confirm Password must be at least 8 characters long." })
            .max(30, { message: "Confirm Password cannot exceed 30 characters." })
            .regex(/[A-Z]/, {
                message: "Confirm Password must contain at least one uppercase letter.",
            })
            .regex(/[a-z]/, {
                message: "Confirm Password must contain at least one lowercase letter.",
            })
            .regex(/[0-9]/, { message: "Confirm Password must contain at least one number." })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Confirm Password must contain at least one special character.",
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });