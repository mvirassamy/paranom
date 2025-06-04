import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import paraDaft from "../../assets/Collection/Daft Punk Jaune H.png"
import paraFreddy from "../../assets/Collection/Freddy Mercury F.png"
import paraLelouch from "../../assets/Collection/Lelouch F.png"
import paraKill from "../../assets/Collection/Kill Bill H.png"
import paraSpiderman from "../../assets/Collection/Spiderman B H.png"
import paraAmber from "../../assets/Collection/Amber H.png"
import "./slider.css";
import {UiCardImage} from "../Card/UiCardImage";
// breakpoint size
// sm: 640
// md: 768
// lg: 1024
// xl: 1280
// 2xl: 1536

export const UiCardSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        pauseOnHover: true,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
        ]
    };
    return (
        <Slider {...settings} >
            {data.map((item, id) => (
                <UiCardImage key={id} title={item.name} description={item.description} image={item.img} />
            ))}
        </Slider>
    );
}

const data = [
    {
        name: `Daft`,
        img: paraDaft,
        description: `Lorem ipsum dolor sit amet`
    },
    {
        name: `Lelouch`,
        img: paraLelouch,
        description: `Lorem ipsum dolor sit amet`
    },
    {
        name: `Freddy`,
        img: paraFreddy,
        description: `Lorem ipsum dolor sit amet`
    },
    {
        name: `Kill Bill`,
        img: paraKill,
        description: `Lorem ipsum dolor sit amet`
    },
    {
        name: `Spiderman`,
        img: paraSpiderman,
        description: `Lorem ipsum dolor sit amet`
    },
    {
        name: `Amber H`,
        img: paraAmber,
        description: `Lorem ipsum dolor sit amet`
    },

];