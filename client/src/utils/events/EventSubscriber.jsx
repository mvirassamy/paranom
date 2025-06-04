import { ethers } from 'ethers';

class EventSubscriber {
    constructor(contractAddress, abi, providerUrl) {
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.contract = new ethers.Contract(contractAddress, abi, this.provider);
    }

    getContract() {
        return this.contract;
    }

    subscribeToEvents(eventName, onEvent) {
        this.contract.on(eventName, onEvent);
    }

    subscribeToEventsWithFilter(filter, onEvent) {
        this.contract.on(filter, onEvent);
    }

    unsubscribeFromEvents(eventName, onEvent) {
        this.contract.off(eventName, onEvent);
    }

    unsubscribeToEventsWithFilter(filter, onEvent) {
        this.contract.off(filter, onEvent);
    }
}

export default EventSubscriber;
