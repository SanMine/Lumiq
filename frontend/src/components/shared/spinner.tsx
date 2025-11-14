import { ImSpinner9 } from "react-icons/im";

interface SpinnerProps {
    isLoading: boolean,
    label?: string,
    children: React.ReactNode
}

export default function Spinner({ isLoading, label, children }: SpinnerProps) {
    return (
        <>
            {
                isLoading ? <>
                    <ImSpinner9 className='size-4 animate-spin' />
                    {label && <span>{label}</span>}
                </> : children
            }
        </>
    )
}