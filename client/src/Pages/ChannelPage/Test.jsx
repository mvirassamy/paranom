import {UiHeader} from "../../components/Header/UiHeader.jsx";
import {BallsEffect} from "../../components/BallsEffect/BallsEffect.jsx";
import {UiFooter} from "../../components/Footer/UiFooter.jsx";
import {UiTextArea} from "../../components/TextArea/UiTextArea";
import {UiMessage} from "../../components/Message/UiMessage";
import {UiMyMessage} from "../../components/Message/UiMyMessage.jsx";
import {UiProfile} from "../../components/UiProfile/UiProfile.jsx";
import {useRecoilValue} from "recoil";
import {profileItemState} from "../../Atoms/ProfileItemState.jsx";
import {useEffect, useRef, useState} from "react";
import {getMessages} from "../../utils/Web3Utils.jsx";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {UiButton} from "../../components/Button/UiButton";
import {useNavigate} from "react-router-dom";
dayjs.extend(relativeTime)

export const Test = ({web3Infos}) => {
    const [messages, setMessages] = useState([]);
    const profileItem = useRecoilValue(profileItemState);
    const messagesEndRef = useRef(null); // Créer une ref pour l'élément de fin des messages
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        try {
            setLoading(true);
            console.log("msg", message);
            const messages = await web3Infos.marketplace.methods.sendMessage(message, profileItem.image, profileItem.name).send({
                from: web3Infos.account,
                gas: 3000000
            });
            setMessage("");
            await initMessages()
            console.log("Transaction result: ", messages);
        } catch (e) {
            console.error("Error during purchase: ", e);
        } finally {
            setLoading(false);
        }
    };

    async function initMessages() {
        const allMessages = await getMessages(web3Infos.marketplace, web3Infos.account);
        console.log("allMessages", allMessages);

        setMessages(allMessages);
    }

    // Faire défiler jusqu'à la fin des messages après que le composant a été monté
    useEffect(() => {
        if (messages.length > 0)
            messagesEndRef.current?.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
    }, [messages]);

    useEffect(() => {
        if (web3Infos.account)
            initMessages();


    }, [web3Infos.account]);

    return (
        <div className="bg-neutral-300 h-full flex items-start justify-center">
            <div className="h-full flex flex-col w-11/12 md:w-11/12 2xl:w-2/3">
                <UiHeader items={["Channel"]} componentEnd={<UiProfile image={profileItem.image} colors={profileItem.colors} name={profileItem.name}/>} />
                <div className="flex flex-col bg-white shadow-lg rounded-lg mt-10" style={{ maxHeight: '70vh' }}>
                    <div className="overflow-auto mt-3 flex-grow">
                        <div className="ml-5 space-y-3">
                            {messages.map((item, index) => {
                                const isMyMessage = item.sender.toLowerCase() === web3Infos.account.toLowerCase();
                                const timestamp = Number(item.timestamp);
                                const date = dayjs.unix(timestamp);
                                const dateAgo = date.fromNow();
                                console.log("item", item);
                                return (
                                    isMyMessage ? (
                                        <div key={index} className="flex justify-end">
                                            <UiMyMessage message={item.content} tag={dateAgo} />
                                        </div>
                                    ) : (
                                        <div key={index}>
                                            <UiMessage message={item.content} tag={dateAgo} name={item.name} image={item.profilePicture} />
                                        </div>
                                    )
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="p-4">
                        <UiTextArea text={message} setText={setMessage} loading={loading} onClick={sendMessage} />
                    </div>
                </div>
                <div className="mx-auto p-10">
                    <UiButton title="Back Home" onClick={() => navigate("/")} />
                </div>
                <BallsEffect />
                <UiFooter title="A NFT Card Game" />
            </div>
        </div>
    )
}
