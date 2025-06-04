import { defineChain } from 'viem';

export const ganache = defineChain({
    id: 1337, // Identifiant de réseau Ethereum pour Ganache
    name: 'Ganache', // Nom de votre chaîne Ganache
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, // Devise native Ethereum
    rpcUrls: {
        default: { http: ['http://127.0.0.1:7545'] }, // URL RPC de votre instance Ganache
    },
    blockExplorers: {
        default: { name: 'Ganache Explorer', url: 'http://127.0.0.1:7545' }, // URL de l'explorateur de blocs pour Ganache (à ajuster si nécessaire)
    },
    contracts: {
        // Adresses des contrats spécifiques si nécessaire
        ensRegistry: {
            address: '', // Ajoutez l'adresse si vous en avez besoin pour votre développement spécifique
        },
        ensUniversalResolver: {
            address: '', // Adresse du résolveur universel ENS si nécessaire
            blockCreated: 0, // Numéro de bloc où le contrat a été déployé
        },
        multicall3: {
            address: '', // Adresse de contrat Multicall3 si nécessaire
            blockCreated: 0, // Numéro de bloc où le contrat a été déployé
        },
    },
});
