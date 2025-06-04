import {atom} from "recoil";
import Anonymous from "../assets/Image/Anonymous.png";

export const defaultProfileItem = {
    image: Anonymous,
    colors: ["#000000", "#000000"],
    name: "Anonymous"
};

export const profileItemState = atom({
    key: 'profileItemState',
    default: defaultProfileItem,
});