/* eslint-disable react/prop-types */
import logoFleur from "../../assets/Logo/LogoSeparatedOneWhite.png"
import logoTitle from "../../assets/Logo/LogoSeparatedTwoWhite.png"
import {UiButton} from "../Button/UiButton";

export const UiCardImage = ({image, title, description, price, buttonInfos}) => {
    return (
        <div className="group w-5/5 h-5/5 flex flex-col p-4 bg-white hover:bg-blue-100 rounded-lg">
            <div className="relative flex items-center justify-center overflow-hidden">
                <img src={image} alt="cardImage" className="rounded-lg transform transition duration-500 group-hover:scale-105"/>
                {buttonInfos &&
                    <div className="invisible group-hover:visible absolute inset-0 flex items-center justify-center font-semibold text-sm text-black">
                        <UiButton title={buttonInfos.title} variation={buttonInfos.variation} onClick={buttonInfos.function}/>
                    </div>
                }
            </div>
            <h1 className="font-semibold text-lg text-neutral-500 mt-3">{title}</h1>
            <p className="font-semibold text-sm text-black">{description}</p>
            <p className="font-semibold text-sm text-blue-400 mt-2">{price}</p>
            <div className="flex mt-2">
                <img className="h-5 w-6" alt="logoWhite" src={logoFleur} />
                <img className="h-5 w-28 invisible group-hover:visible" alt="logoWhite" src={logoTitle} />
            </div>
        </div>
    )
}