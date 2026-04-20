import { Spinner } from "../ui/spinner"

export const LoadingCenter = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <Spinner />
        </div>
    )
}