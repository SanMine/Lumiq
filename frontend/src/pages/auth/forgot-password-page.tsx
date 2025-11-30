import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(ForgotPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            // TODO: Implement actual password reset API call
            // For now, just show success message
            console.log("Password reset requested for:", data.email);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Password reset link sent!");
            setIsSubmitted(true);
        } catch (error: any) {
            toast.error(error?.message || "Failed to send reset link");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <Card className="w-full max-w-md border-2">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Link to="/auth/sign-in">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    </div>
                    <CardDescription>
                        {isSubmitted
                            ? "Check your email for a password reset link"
                            : "Enter your email address and we'll send you a link to reset your password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
                                <p className="font-medium">Email sent successfully!</p>
                                <p className="mt-1 text-xs">
                                    If an account exists with <strong>{form.getValues("email")}</strong>, you will receive a
                                    password reset link shortly.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full"
                                >
                                    Try another email
                                </Button>
                                <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                                    <Link to="/auth/sign-in">Back to Sign In</Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email <span className="text-red-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    disabled={form.formState.isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link to="/auth/sign-in">Back to Sign In</Link>
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
