import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RecoilRoot} from "recoil";
import {Web3ModalProvider} from "./components/web3Modal/Web3ModalProvider";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RecoilRoot>
            <Web3ModalProvider>
                <App/>
            </Web3ModalProvider>
        </RecoilRoot>
    </React.StrictMode>,
)
