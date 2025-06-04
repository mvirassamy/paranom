import {UiSubHeader} from "../../components/SubHeader/UiSubHeader.jsx";
import {EaseOutWhenVisibleLeft} from "../../components/Motion/EaseOutWhenVisibleLeft.jsx";
import {UiStepper} from "../../components/Stepper/UiStepper.jsx";
import {EaseOutWhenVisibleDown} from "../../components/Motion/EaseOutWhenVisibleDown";
import ParanomBoomrang from "../../assets/Gif/ParanomBoomrang.gif"
import {UiTitle} from "../../components/Title/UiTitle.jsx";
import wallet from "../../assets/Image/wallet.png";
import fireworks from "../../assets/Image/fireworks.png";
import discussion from "../../assets/Image/discussion_talk.png";
import paranom from "../../assets/Image/Lelouch F.png";
import {UiButton} from "../../components/Button/UiButton.jsx";
import {Warning} from "../../components/svg/Warning.jsx";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {canLoadConfigState} from "../../Atoms/CanLoadConfigState.jsx";
import {modalInfosState} from "../../Atoms/ModalInfosState.jsx";
import {useNavigate} from "react-router-dom";
import {Lock} from "../../components/svg/Lock";
import {UiModalLogin} from "../../components/Modal/UiModalLogin.jsx";
import {useDisconnect} from "wagmi";

export const GamePage = ({web3Infos}) => {
    const [, setModalInfos] = useRecoilState(modalInfosState);
    const navigate = useNavigate();
    const [showModalLogin, setShowModalLogin] = useState(false);
    const { disconnect } = useDisconnect()

    const gifComponent = <img src={ParanomBoomrang} alt="ParanomBoomerang"
                              className="rounded-lg shadow-md border-8 border-violet-200 w-72 sm:w-80 lg:w-7/12 xl:w-5/12" />;

    const connectWallet = async () => {
        if (window.ethereum) {
            setShowModalLogin(true);
        } else {
            setModalInfos({
                title: "Sorry...",
                description: "Wallet Not Detected",
                btnTitle: "Ok",
                icon: <Warning color="red" variant="600"/>,
                show: true
            })
        }
    }

    const joinChannel =  async () => {
        const canJoinChannel = await web3Infos.marketplace.methods.canJoinChannel().call({
            from: web3Infos.account
        });

       if (canJoinChannel) {
           navigate("/channel");
       } else {
           setModalInfos({
               title: "Sorry...",
               description: "You are not a member of Paranom..",
               btnTitle: "Ok",
               color: "blue",
               icon: <Lock />,
               show: true
           })
       }

    };

    useEffect( () => {
        console.log("account r", web3Infos.account);
    }, [web3Infos.account]);

    const buttonComponent = web3Infos.account
        ? <div className="space-x-3">
            <UiButton title="Disconnect" color="neutral" onClick={() => disconnect()} />
            <UiButton title="Join channel" color="blue" variation="300" onClick={joinChannel} />
        </div>
        : <UiButton title="Connect wallet" color="neutral" onClick={connectWallet} />;

    return (
        <div className="mt-8">
            <div className="mt-8">
                <UiModalLogin closeModal={() => setShowModalLogin(false)} showModal={showModalLogin} />
                <EaseOutWhenVisibleDown>
                    <UiSubHeader title="Welcome to Paranom"
                                 titleSecond="the NFT social network"
                                 subTitle="Start chatting anonymously with"
                                 subTitleSecond="users to exchange ideas and opinions"
                                 componentRight={gifComponent}
                                 componentInteractive={buttonComponent}

                    />
                </EaseOutWhenVisibleDown>
            </div>

            <div className="mt-10 pb-5">
                <EaseOutWhenVisibleLeft>
                    <div className="mb-10">
                        <UiTitle title="Get one and have fun"/>
                    </div>
                    <UiStepper data={data}/>
                </EaseOutWhenVisibleLeft>
            </div>

        </div>
    )
}

const data = [
    {
        title: "Set up your wallet",
        description: "Well, aren't you going up to the lake tonight, you've been planning it for two weeks.",
        tag: "STEP-01",
        img: wallet,
    },
    {
        title: "Chose a Paranom",
        description: "Well, aren't you going up to the lake tonight, you've been planning it for two weeks.",
        tag: "STEP-02",
        img: paranom,
    },
    {
        title: "Join the chat",
        description: "Well, aren't you going up to the lake tonight, you've been planning it for two weeks.",
        tag: "STEP-03",
        img: discussion,
    },
    {
        title: "Have fun",
        description: "Well, aren't you going up to the lake tonight, you've been planning it for two weeks.",
        tag: "STEP-04",
        img: fireworks,
    },
];