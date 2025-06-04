import logo from '../../assets/Logo/logoParanomFleurBlack.png';
import {useEffect} from "react";
import {EaseOutWhenVisibleLeft} from "../Motion/EaseOutWhenVisibleLeft";
import { useRecoilState } from 'recoil';
import {itemSelectedState} from "../../Atoms/ItemSelectedState.jsx";

// https://tailwindcomponents.com/component/free-tailwind-css-header-component
export const UiHeader = ({items = ["Home", "Collection"], button, componentEnd}) => {
    const { title, onClick, color, size } = button || {};
    const [selected, setSelected] = useRecoilState(itemSelectedState);

    useEffect(() => {
        if (items.length > 0)
            setSelected(items[0]);
    }, []);

    const getStyle = (test) => {
        if (selected === test)
            return "z-40 mr-5 text-blue-500 font-semibold hover:text-blue-500 cursor-pointer";
        else
            return "z-40 mr-5 text-gray-800 font-semibold hover:text-blue-500 cursor-pointer";
    }

    const selectNew = () => {
        let newL = document.getElementById("list");
        newL.classList.toggle("hidden");

        document.getElementById("ArrowSVG").classList.toggle("rotate-180");
    }

    const selectedSmall = (item) => {
        let text = event.target.innerText;
        let newL = document.getElementById("list");
        let newText = document.getElementById("textClicked");
        newL.classList.add("hidden");
        document.getElementById("ArrowSVG").classList.toggle("rotate-180");
        newText.innerText = text;

        setSelected(item);
    }

    return (
        <div>
            <div className="pb-3 pt-5">
                <nav className="flex justify-between">
                    <div className="flex items-center justify-center space-x-3 lg:pr-16 pl-3">
                        <img src={logo} alt="Logo" className="w-40 " />
                    </div>

                    <div>
                        <div className="visible md:hidden flex z-40 cursor-pointer mt-2" onClick={() => selectNew()}>
                            <p className="z-40 mr-5 text-blue-500 font-semibold hover:text-blue-500 cursor-pointer"
                               id="textClicked"
                            >
                                {selected}
                            </p>
                            <svg id="ArrowSVG" className="transform z-50" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <ul className="hidden md:flex flex-auto space-x-2 pt-2">
                            {items.map((item, id) =>
                                <li onClick={() => setSelected(item)}
                                    className={getStyle(item)}
                                    key={id}
                                >
                                    {item}
                                </li>
                            )}
                        </ul>
                    </div>
                    {componentEnd}
                </nav>

                <EaseOutWhenVisibleLeft>
                <div className="block md:hidden">
                    <div
                        className="hidden absolute z-30 w-56 py-2 mt-2 left-1/2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800" id="list">

                            {items.map((item, id) =>
                                <a onClick={() => selectedSmall(item)}
                                   href="#"
                                   className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                    key={id}
                                >
                                    {item}
                                </a>
                            )}

                    </div>
                </div>
                </EaseOutWhenVisibleLeft>
            </div>
            <hr />
        </div>
    )
}