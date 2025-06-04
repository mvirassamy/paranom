import {Bell} from "../svg/Bell";
import { motion, useAnimation } from "framer-motion";
import {useEffect} from "react";

const defaultButton = [
    {
        title: "Ok",
        type: "button",
    },
]

export const UiModal = ({ showModal, closeModal, title, description, color = "red", icon = <Bell/>, buttons = defaultButton}) => {
    const controls = useAnimation();

    buttons.forEach((btn) => {
        let btnColor = btn.color ?? color;
        if (!btn.className)
            btn.className = `w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-${btnColor}-500 text-base font-medium text-white hover:bg-${btnColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${btnColor}-500 sm:ml-3 sm:w-auto sm:text-sm`;
    });

    const onClick = async (btnFunction) => {
        await controls.start({ opacity: 0, y: -50 });
        if (btnFunction)
            btnFunction();
        closeModal();
    };

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
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${color}-100 sm:mx-0 sm:h-10 sm:w-10`}>
                                {icon}
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </div>
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