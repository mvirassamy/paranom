export const UiMessage = ({message, image, tag, name}) => {
    return (
        <div className="">
            <div
                className="relative mr-3 max-w-[400px] rounded-md border border-slate-50 bg-white p-4 text-sm shadow-lg">
                <div className="flex space-x-4">
                    <div className="relative h-10 w-10">
                        <img
                            className="h-full w-full rounded-full object-cover object-center"
                            src={image}
                            alt="profile"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="pr-6 font-medium text-slate-900">
                            {name} <span className="ml-2 font-normal text-slate-500">{tag}</span>
                        </h4>
                        <div className="mt-1 text-slate-500">
                            {message}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}