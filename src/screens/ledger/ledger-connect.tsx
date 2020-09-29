import { withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { LedgerConnectComponent } from './ledger-connect-component';
import stylesProvider from './styles';

export class LedgerConnect {
    public static readonly Component = smartConnect(LedgerConnectComponent, [
        withTheme(stylesProvider)
    ]);

    public static getAccountsAndDeviceId = LedgerConnectComponent.getAccountsAndDeviceId;

    public static walletCreated = LedgerConnectComponent.walletCreated;

    public static signTransaction = LedgerConnectComponent.signTransaction;

    public static close = LedgerConnectComponent.close;
}
