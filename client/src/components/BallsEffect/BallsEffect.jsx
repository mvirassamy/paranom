export const BallsEffect = () => {
    return (
        <div className="w-full max-w-lg">
            <div
                className="absolute top-0 -left-4 w-72 h-72 z-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div
                className="absolute top-0 -right-4 w-72 h-72 z-20 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div
                className="absolute -bottom-8 left-20 w-72 h-72 z-20 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div
                className="invisible 2xl:visible absolute bottom-1/4 right-2/4 w-72 h-72 z-20 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
    )
}