import {atom} from "recoil";
import {Warning} from "../components/svg/Warning.jsx";

export const modalInfosState = atom({
    key: 'modalInfosState',
    default: {
        title: "default",
        description: "default",
        btnTitle: "ok",
        color: "red",
        icon: <Warning color="red" variant="600"/>,
        show: false,
    },
});