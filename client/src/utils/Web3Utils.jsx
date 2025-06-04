import {ethers} from 'ethers';
import {defaultProfileItem} from "../Atoms/ProfileItemState.jsx";

export const NftStorageGateway = "https://nftstorage.link/ipfs/";

export const convertIpfsUrl = (ipfsUrl, gatewayBaseUrl = "https://ipfs.io/ipfs/") => {
    const ipfsPattern = /ipfs:\/\/(.+)/;

    const match = ipfsUrl.match(ipfsPattern);
    if (match) {
        return `${gatewayBaseUrl}${match[1]}`;
    }
    return ipfsUrl;
};

export const loadItems = async (marketplace, nft) => {
    const itemCount = await marketplace.methods.itemCount().call();
    let listedItems = []

    for (let indx = 1; indx <= itemCount; indx++) {
        const i = await marketplace.methods.items(indx).call();
        const uri = await nft.methods.tokenURI(i.tokenId).call();
        const response = await fetch(uri);
        const metadata = await response.json();
        let item = {
            buttonInfos: {
                title: "Buy a Paranom",
                variation: "500"
            },
            id: i.itemId,
            price: ethers.formatEther(i.price) + " ETH",
            name: metadata.name,
            description: metadata.description,
            image: convertIpfsUrl(metadata.image, NftStorageGateway),
            attributes: metadata.attributes
        };
        if (!i.sold)
            listedItems.push(item);
    }
    return listedItems;
}

export const getProfileItem = async (marketplace, nft, account) => {
    try {
        const itemProfileId = await marketplace.methods.getOwnerItemProfile(account).call();
        const uri = await nft.methods.tokenURI(itemProfileId.itemId).call();
        const response = await fetch(uri);
        const metadata = await response.json();

        if (!metadata || !metadata.attributes) {
            throw new Error("Invalid metadata");
        }

        const { color_primary, color_secondary } = metadata.attributes[0];
        return {
            image: convertIpfsUrl(metadata.image, NftStorageGateway),
            colors: [color_primary, color_secondary],
            name: metadata.name
        };
    } catch (e) {
        console.log("error", e);
        return defaultProfileItem;
    }
}

export const getMessages = async (marketplace, account) => {
    try {
        return await marketplace.methods.getMessages().call({
            from: account
        });
    } catch (e) {
        console.error("error", e);
    }
}