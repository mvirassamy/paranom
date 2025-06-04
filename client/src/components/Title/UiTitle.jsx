export const UiTitle = ({title, subTitle}) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-neutral-700 sm:text-3xl md:text-3xl mb-2">
                {title}
            </h2>
            <h2 className="text-xl font-semibold text-neutral-500 sm:text-xl md:text-xl mb-2">
                {subTitle}
            </h2>
        </div>

    )
}