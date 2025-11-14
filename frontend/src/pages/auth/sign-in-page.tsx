
import AuthForm from "@/components/auth/auth-form"
import { SignInFormSchema } from "@/lib/validators"

export default function SignInPage() {
  return (
    <AuthForm
      formType="SIGNIN"
      schema={SignInFormSchema}
      defaultValues={{
        email: "",
        password: ""
      }}
    />
  )
}
