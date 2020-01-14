import { NavigationService } from '../../navigation/navigation-service';

export const signExtensionTransaction = payload => {
    const data = payload.params[0];

    NavigationService.navigate('Account', {
        blockchain: data.currentAccount.blockchain,
        accountIndex: data.currentAccount.index,
        extensionTransactionPayload: payload
    });
};
