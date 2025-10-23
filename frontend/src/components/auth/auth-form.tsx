/* eslint-disable @typescript-eslint/no-explicit-any */
import { SIGNIN, SIGNIN_SUBTITLE, SIGNIN_TITLE, SIGNUP, SIGNUP_SUBTITLE, SIGNUP_TITLE } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm, type ControllerRenderProps, type DefaultValues, type Path, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import Spinner from '../shared/spinner';
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface AuthFormProps<T extends z.ZodType<any, any, any>> {
    formType: "SIGNIN" | "SIGNUP",
    schema: T,
    defaultValues: z.infer<T>,
}

export default function AuthForm<T extends z.ZodType<any, any, any>>({
    formType,
    schema,
    defaultValues,
    ...props
}: AuthFormProps<T>) {
    type FormData = z.infer<T>
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: defaultValues as DefaultValues<FormData>,
        resolver: zodResolver(schema) as any,
    })

    const handleSubmit: SubmitHandler<FormData> = async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log(values)
        navigate('/')
    }

    const buttonText = formType === 'SIGNIN' ? SIGNIN : SIGNUP

    const isWorking = form.formState.isSubmitting

    return (
        <Form {...form}>
            <form className="gap-6 flex flex-col" onSubmit={form.handleSubmit(handleSubmit)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-xl md:text-2xl font-bold">{formType === 'SIGNIN' ? SIGNIN_TITLE : SIGNUP_TITLE}</h1>
                    <p className="text-muted-foreground text-xs md:text-sm text-balance">
                        {formType === 'SIGNIN' ? SIGNIN_SUBTITLE : SIGNUP_SUBTITLE}
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    {
                        Object.keys(defaultValues).map(field => (
                            <FormField
                                key={field}
                                control={form.control}
                                name={field as Path<FormData>}
                                render={({ field }: { field: ControllerRenderProps<FormData, Path<FormData>> }) => (
                                    <FormItem className="grid gap-3">
                                        <div className="flex items-center gap-1 justify-between">
                                            <FormLabel>
                                                {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                                <span className="text-red-600"> *</span>
                                            </FormLabel>
                                            {formType === 'SIGNIN' && field.name === 'password' && <Link
                                                to="/forgot-password"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot password?
                                            </Link>}
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    className="min-h-[44px] pr-10"
                                                    disabled={isWorking}
                                                    placeholder={field.name === 'email' ? 'Email' : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                                    inputMode="numeric"
                                                    type={(field.name === 'password' || field.name === 'confirmPassword') && showPassword[field.name] ? 'text' : (field.name === 'password' || field.name === 'confirmPassword') ? 'password' : 'text'}
                                                    {...field}
                                                />
                                                {(field.name === 'password' || field.name === 'confirmPassword') && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(prev => ({
                                                                ...prev,
                                                                [field.name]: !prev[field.name]
                                                            }))
                                                        }
                                                        className="absolute cursor-pointer right-3 top-3.5 text-muted-foreground"
                                                    >
                                                        {showPassword[field.name] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))
                    }
                    <div className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full min-h-[48px] flex items-center gap-2 justify-center cursor-pointer bg-gradient text-white"
                            disabled={isWorking}
                        >
                            <Spinner
                                isLoading={isWorking}
                                label={buttonText === 'Sign In' ? 'Signing In...' : 'Signing Up...'}>
                                {buttonText}
                            </Spinner>
                        </Button>
                        {formType === 'SIGNIN' &&
                            <>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <Button type="button" disabled={isWorking} variant="outline" className="w-full min-h-[48px] cursor-pointer" asChild>
                                    <Link to='/' className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="24" height="24" aria-hidden="true" role="img">
                                            <path d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95h147.4c-6.4 34.7-25.9 64.1-55.4 83.7v69.3h89.3c52.2-48 82.2-118.9 82.2-197.7z" fill="#4285F4" />
                                            <path d="M272 544.3c73.6 0 135.5-24.4 180.6-66.2l-89.3-69.3c-24.8 16.6-56.6 26.6-91.3 26.6-70.3 0-130-47.5-151.3-111.3H30.4v69.9C75.6 480.7 167.5 544.3 272 544.3z" fill="#34A853" />
                                            <path d="M120.7 323.9c-10.7-31.8-10.7-65.9 0-97.7V156.3H30.4C10.8 197 0 238.9 0 272s10.8 75 30.4 115.7l90.3-63.8z" fill="#FBBC05" />
                                            <path d="M272 107.7c38.8 0 73.8 13.4 101.3 39.7l76-76C407.2 24.8 344.9 0 272 0 167.5 0 75.6 63.6 30.4 156.3l90.3 69.9C142 155.2 201.7 107.7 272 107.7z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </Link>
                                </Button>
                            </>
                        }
                    </div>
                </div>
                {
                    formType === 'SIGNIN' ?
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to='/auth/sign-up'
                                className="underline-offset-4 hover:underline font-bold tracking-wider">
                                Sign up
                            </Link>
                        </div> :
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/auth/sign-in" className="underline-offset-4 hover:underline font-bold">
                                Sign in
                            </Link>
                        </div>
                }
            </form>
        </Form>
    )
}