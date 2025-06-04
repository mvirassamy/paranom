import {UiHeader} from "../../components/Header/UiHeader.jsx";
import {itemSelectedState} from "../../Atoms/ItemSelectedState.jsx";
import {useRecoilValue} from "recoil";
import {GamePage} from "../GamePage/GamePage";
import {CollectionPage} from "../CollectionPage/CollectionPage";
import {UiFooter} from "../../components/Footer/UiFooter";
import {BallsEffect} from "../../components/BallsEffect/BallsEffect.jsx";
import {UiProfile} from "../../components/UiProfile/UiProfile.jsx";
import {profileItemState} from "../../Atoms/ProfileItemState.jsx";

export const HomePage = ({web3Infos}) => {
    const itemSelected = useRecoilValue(itemSelectedState);
    const profileItem = useRecoilValue(profileItemState);

    return (
        <div className="bg-neutral-300 h-full flex items-start justify-center">
            <div className="h-full flex flex-col w-11/12 md:w-11/12 2xl:w-2/3">
                <UiHeader componentEnd={<UiProfile image={profileItem.image} colors={profileItem.colors} name={profileItem.name}/>} />
                {itemSelected === "Home" ? <GamePage web3Infos={web3Infos}/> : <CollectionPage web3Infos={web3Infos} />}
                <BallsEffect />
                <UiFooter title="A NFT Card Game" />
            </div>
        </div>
    )
}