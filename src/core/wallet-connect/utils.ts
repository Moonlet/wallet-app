import { NavigationService } from '../../navigation/navigation-service';
import { getBlockchain } from '../blockchain/blockchain-factory';
import { NavigationParams } from 'react-navigation';

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
