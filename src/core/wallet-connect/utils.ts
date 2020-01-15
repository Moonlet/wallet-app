import { NavigationService } from '../../navigation/navigation-service';
import { getBlockchain } from '../blockchain/blockchain-factory';

export const signExtensionTransaction = payload => {
    const data = payload.params[0];

    NavigationService.navigate('Token', {
        blockchain: data.currentAccount.blockchain,
        accountIndex: data.currentAccount.index,
        token: data.token,
        tokenLogo: getBlockchain(data.currentAccount.blockchain).config.tokens[
            getBlockchain(data.currentAccount.blockchain).config.coin
        ].logo,
        extensionTransactionPayload: payload
    });
};
