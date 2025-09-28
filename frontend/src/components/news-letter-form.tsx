
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NewsLetterFormSchema } from "@/lib/validators"
import { toast } from "sonner"
import { FaPaperPlane } from "react-icons/fa"
import Spinner from "./shared/spinner"

export default function NewsLetterForm() {
    const form = useForm<z.infer<typeof NewsLetterFormSchema>>({
        defaultValues: {
            email: ''
        },
        resolver: zodResolver(NewsLetterFormSchema)
    })

    const onSubmit: SubmitHandler<z.infer<typeof NewsLetterFormSchema>> = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        form.reset()
        toast.success("Success", {
            description: "Subscribed to newsletter"
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full pr-8 lg:pr-0" autoComplete="off">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof NewsLetterFormSchema>, "email"> }) => (
                        <FormItem className="relative space-y-0">
                            <FormLabel className="sr-only">Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    className="pr-12 text-sm"
                                    disabled={form.formState.isSubmitting}
                                    placeholder="name@gmail.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            <Button
                                className="absolute top-[4px] right-[3.5px] size-7 z-20 cursor-pointer"
                                size='icon'
                                disabled={form.formState.isSubmitting}>
                                <Spinner
                                    isLoading={form.formState.isSubmitting}>
                                    <FaPaperPlane className="size-3" aria-hidden="true" />
                                </Spinner>
                                <span className="sr-only">Join newsletter</span>
                            </Button>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}