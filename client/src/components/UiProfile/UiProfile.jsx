import Anonymous from "../../assets/Image/Anonymous.png";

export const UiProfile = ({image= Anonymous, name="Anonymous", colors = ["#000000", "#000000"]}) => {
    const gradientColors = colors.join(', ');

    return (
        <div className="flex justify-center items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-#32a852 via-red-500 to-yellow-500 p-0.5"
                 style={{ backgroundImage: `linear-gradient(to right, ${gradientColors})` }}>
                <img
                    src={image}
                    alt="Anonymous" className="w-full h-full rounded-full object-cover"/>
            </div>
            <div className="hidden sm:block dark:text-white text-gray-900 text-sm font-semibold">
                <div className="cursor-pointer">{name}</div>
            </div>
        </div>
    )
}