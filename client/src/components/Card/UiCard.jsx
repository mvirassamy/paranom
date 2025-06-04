
export const UiCard = ({title, tag, description, image}) => {
    return (
            <div
                className="group max-w-fit 2xl:max-w-xl 2xl:h-6/6 rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl">
                {image && <div className="flex flex-col items-end">
                    <img src={image} width={60} alt="wallet" className="absolute rounded-full -mr-3 -mt-6" />
                </div>}

                <p className="group-hover:font-semibold m-5 text-neutral-500">{tag}</p>
                <div className="m-5">
                    <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl md:text-lg mb-2">
                        {title}
                    </h2>
                    <p className="group-hover:text-blue-400 text-medium mb-5 text-gray-700">{description}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd"
                              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                              clipRule="evenodd"/>
                    </svg>

                </div>
            </div>
    )
}