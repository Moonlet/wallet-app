import { NavigationService } from '../../navigation/navigation-service';
import { getBlockchain } from '../blockchain/blockchain-factory';

export const signExtensionTransaction = payload => {
    const data = payload.params[0];

    NavigationService.navigate('Token', {
        blockchain: data.selectedAccount.blockchain,
        accountIndex: data.selectedAccount.index,
        token: data.token,
        tokenLogo: getBlockchain(data.selectedAccount.blockchain).config.tokens[
            getBlockchain(data.selectedAccount.blockchain).config.coin
        ].logo,
        extensionTransactionPayload: payload
    });
};
