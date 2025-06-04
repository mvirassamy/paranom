import { motion, useAnimation } from "framer-motion";
import {useEffect} from "react";
import {useConnect} from "wagmi";
import {useRecoilState} from "recoil";
import {canLoadConfigState} from "../../Atoms/CanLoadConfigState.jsx";

export const UiModalLogin = ({ showModal, closeModal}) => {
    const controls = useAnimation();
    const buttons = [
        {
            title: "Fermer",
            type: "button",
            className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        },
    ]
    const [, setCanLoadConfig] = useRecoilState(canLoadConfigState);

    const { connectors, connect, status, error } = useConnect()


    const onClick = async () => {
        await controls.start({ opacity: 0, y: -50 });
        closeModal();
    };

    useEffect(() => {
        if (status === 'success') {
            setCanLoadConfig(true);
            onClick();
        }
    }, [status]);

    useEffect(() => {
        if (showModal) {
            controls.start({ opacity: 1, y: 0 });
        }
    }, [controls, showModal]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={controls}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className={`fixed z-40 inset-0 overflow-y-auto ${
                showModal ? "block" : "hidden"
            }`}
        >
        <div className={`fixed z-40 inset-0 overflow-y-auto ${showModal ? 'block' : 'hidden'}`}>
            <div
                className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
                onClick={closeModal}
            >
                <div
                    className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute top-2 right-2 cursor-pointer"
                         onClick={onClick}
                    >
                        <svg className="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </div>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z" clipRule="evenodd"/>
                                    <path fillRule="evenodd" d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Choose your wallet
                                </h3>
                                <div className="mt-1">
                                    <p className="text-sm text-gray-500">
                                        The one you prefer !
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto w-1/2">
                        {connectors.map((connector) => (
                            <button
                                key={connector.uid}
                                onClick={() => connect({ connector })}
                                type="button"
                                className="mb-3 w-full bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-md transition duration-100"
                            >
                                {connector.name}
                            </button>
                        ))}
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {buttons.map((item, id) => (
                            <button
                                key={id}
                                type={item.type}
                                className={item.className}
                                onClick={() => onClick(item.onClick)}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </motion.div>
    );
};