export const ErrorCenter = ({ message }: { message: string }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center h-full w-full gap-4">
            <p>{message}</p>
        </div>
    )
}