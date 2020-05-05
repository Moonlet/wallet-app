import { getBlockchain } from '../blockchain/blockchain-factory';
import { NavigationParams } from 'react-navigation';
import { NavigationService } from '../../navigation/navigation-service';

export const getUrlParams = (search = ``) => {
    const hashes = search.slice(search.indexOf('?') + 1).split('&');
    return hashes.reduce((params, hash) => {
        const split = hash.indexOf('=');

        if (split < 0) {
            return { ...params, [hash]: null };
        }

        const key = hash.slice(0, split);
        const val = hash.slice(split + 1);

        return { ...params, [key]: decodeURIComponent(val) };
    }, {});
};

export const signExtensionTransaction = payload => {
    const data = payload.params[0];
    const blockchainConfig = getBlockchain(data.selectedAccount.blockchain).config;
    const navigationParams: NavigationParams = {
        blockchain: data.selectedAccount.blockchain,
        accountIndex: data.selectedAccount.index,
        token: data.token,
        tokenLogo: blockchainConfig.tokens[blockchainConfig.coin].icon,
        extensionTransactionPayload: payload
    };

    if (NavigationService.getCurrentRoute() === 'Token') {
        NavigationService.replace('Token', navigationParams);
    } else {
        NavigationService.navigate('Token', navigationParams);
    }
};
