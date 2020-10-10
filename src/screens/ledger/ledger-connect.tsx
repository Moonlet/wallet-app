import { withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { LedgerConnectComponent, IReduxProps } from './ledger-connect-component';
import stylesProvider from './styles';
import { IReduxState } from '../../redux/state';
import { getSelectedWallet } from '../../redux/wallets/selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state: IReduxState): IReduxProps => {
    return {
        wallet: getSelectedWallet(state)
    };
};

export class LedgerConnect {
    public static readonly Component = smartConnect(LedgerConnectComponent, [
        connect(mapStateToProps),
        withTheme(stylesProvider)
    ]);

    public static getAccountsAndDeviceId = LedgerConnectComponent.getAccountsAndDeviceId;

    public static walletCreated = LedgerConnectComponent.walletCreated;

    public static sign = LedgerConnectComponent.sign;

    public static close = LedgerConnectComponent.close;
}
