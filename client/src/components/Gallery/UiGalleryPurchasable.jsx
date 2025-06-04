import paraDaft from "../../assets/Collection/Daft Punk Jaune H.png";
import paraLelouch from "../../assets/Collection/Lelouch F.png";
import paraFreddy from "../../assets/Collection/Freddy Mercury F.png";
import paraKill from "../../assets/Collection/Kill Bill H.png";
import paraSpiderman from "../../assets/Collection/Spiderman B H.png";
import paraAmber from "../../assets/Collection/Amber H.png";
import {UiCardPurchasable} from "../Card/UiCardPurchasable";

export const UiGalleryPurchasable = ({data = [], web3Infos}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.map((item, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg">
                    <UiCardPurchasable
                                 title={item.name}
                                 id={item.id}
                                 description={item.description}
                                 image={item.image}
                                 price={item.price}
                                 web3Infos={web3Infos}
                                 buttonInfos={item.buttonInfos}
                                 className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
    );
};


const dataPara = [
    {
        name: `Daft`,
        image: paraDaft,
        description: "Anonymity Collection I"
    },
    {
        name: `Lelouch`,
        image: paraLelouch,
        description: "Anonymity Collection I"
    },
    {
        name: `Freddy`,
        image: paraFreddy,
        description: "Anonymity Collection I"
    },
    {
        name: `Kill Bill`,
        image: paraKill,
        description: "Anonymity Collection I"
    },
    {
        name: `Spiderman`,
        image: paraSpiderman,
        description: "Anonymity Collection I"
    },
    {
        name: `Amber H`,
        image: paraAmber,
        description: "Anonymity Collection I"
    },
    {
        name: `Kill Bill`,
        image: paraKill,
        description: "Anonymity Collection I"
    },
    {
        name: `Spiderman`,
        image: paraSpiderman,
        description: "Anonymity Collection I"
    },
    {
        name: `Amber H`,
        image: paraAmber,
        description: "Anonymity Collection I"
    },

];