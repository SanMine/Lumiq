import AuthForm from "@/components/auth/auth-form";
import { SignUPFormSchema } from "@/lib/validators";

export default function SignUpPage() {
    return (
        <AuthForm
            formType="SIGNUP"
            schema={SignUPFormSchema}
            defaultValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            }}
        />
    )
}
