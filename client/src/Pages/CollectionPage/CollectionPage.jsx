import {UiCardSlider} from "../../components/CardSlider/UiCardSlider.jsx";
import {EaseOutWhenVisibleLeft} from "../../components/Motion/EaseOutWhenVisibleLeft.jsx";
import {EaseOutWhenVisibleDown} from "../../components/Motion/EaseOutWhenVisibleDown.jsx";
import {UiTitle} from "../../components/Title/UiTitle.jsx";
import {UiCardProfile} from "../../components/Card/UiCardProfile.jsx";
import matthias from "../../assets/Collection/PP/Matthias.png";
import thomas from "../../assets/Collection/PP/Thomas.png";
import henri from "../../assets/Collection/PP/Henri.png";
import {UiSubHeader} from "../../components/SubHeader/UiSubHeader.jsx";
import {useRecoilState} from "recoil";
import {listedItemsState} from "../../Atoms/ListedItemsState.jsx";
import {UiGalleryPurchasable} from "../../components/Gallery/UiGalleryPurchasable";

export const CollectionPage = ({web3Infos}) => {
    const [listedItems] = useRecoilState(listedItemsState);

    const profilesComponent = (
        <div className="flex">
            <div className="rotate-[-10deg]">
                <UiCardProfile image={matthias} title="MParanom" description="Digital" />
            </div>
            <div className="hidden sm:block z-20">
                <UiCardProfile image={thomas} title="TParanom" description="Art" />
            </div>
            <div className="rotate-[10deg]">
                <UiCardProfile image={henri} title="HParanom" description="Anonymity" />
            </div>
        </div>
    );

    return (
        <div className="mt-8">
            <div className="mt-8">
                <EaseOutWhenVisibleDown>
                    <UiSubHeader title="Welcome to Paranom"
                                 titleSecond="an art of Anonymity"
                                 subTitle="Immerse yourself in a series of"
                                 subTitleSecond="mysterious unique portraits"
                                 componentRight={profilesComponent}
                    />
                </EaseOutWhenVisibleDown>
            </div>

            <div className="mt-16 md:mt-40 pb-5">
                <EaseOutWhenVisibleLeft>
                    <UiTitle title="Top collection" />
                    <UiCardSlider />
                </EaseOutWhenVisibleLeft>
            </div>

            <div className="pb-5 mt-20">
                <EaseOutWhenVisibleLeft>
                    <UiTitle title="Explore collection" />
                    <UiGalleryPurchasable data={listedItems} web3Infos={web3Infos}/>
                </EaseOutWhenVisibleLeft>
            </div>

        </div>
    )
}