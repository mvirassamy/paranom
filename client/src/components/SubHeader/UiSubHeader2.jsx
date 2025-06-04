import {UiInput} from "../Input/UiInput";
import {UiCardProfile} from "../Card/UiCardProfile";
import Piccolo from "../../assets/Image/Piccolo H.png"
import Lelouch from "../../assets/Image/Lelouch F.png"
import Amber from "../../assets/Image/Amber H.png"
export const UiSubHeader2 = ({title, titleSecond, subTitle, subTitleSecond, input, image, imgClassName}) => {
    return (
        <div>
            <div className="md:flex">
                <div className="md:w-1/2 flex items-center justify-center md:items-start md:justify-start">
                    <div className="md:pt-24">
                        <h1 className="text-dark font-bold text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-snug mb-3">
                            {titleSecond ? (
                                <span>
                                    {title}
                                    <br />
                                    {titleSecond}
                                </span>
                            ) : (
                                title
                            )}
                        </h1>
                        <p className="tracking-wide text-xl text-white font-semibold md:text-[18px] lg:text-[22px] xl:text-[28px] 2xl:text-[30px] leading-snug mb-3">
                            {subTitle ? (
                                <span>
                                    {subTitle}
                                    <br />
                                    {subTitleSecond}
                                </span>
                            ) : (
                                subTitle
                            )}
                        </p>
                        {input &&
                            <div className="mt-7 xl:ml-2 ">
                                <UiInput />
                            </div>
                        }
                    </div>
                </div>
                <div className=" md:w-1/2 flex items-center justify-center pt-10 md:pt-0 overflow-visible">
                    <div className="rotate-[-10deg] ">
                        <UiCardProfile image={Amber} title="MParanom"/>
                    </div>
                    <div className="hidden sm:block z-20">
                        <UiCardProfile image={Lelouch} title="TParanom"/>
                    </div>
                    <div className="rotate-[10deg] ">
                        <UiCardProfile image={Piccolo} title="HParanom"/>
                    </div>
                </div>
            </div>
        </div>
    )
}