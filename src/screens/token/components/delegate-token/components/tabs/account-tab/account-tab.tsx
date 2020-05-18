import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { Blockchain, ChainIdType } from '../../../../../../../core/blockchain/types';
import { AccountAddress } from '../../../../../../../components/account-address/account-address';
import { IAccountState, ITokenState } from '../../../../../../../redux/wallets/state';
import { IReduxState } from '../../../../../../../redux/state';
import { getAccount } from '../../../../../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { StatsComponent } from '../../stats-component/stats-component';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../../../../../redux/preferences/selectors';
import { CtaGroup } from '../../../../../../../components/cta-group/cta-group';
import { Button } from '../../../../../../../library';
import { translate } from '../../../../../../../core/i18n';
import { NavigationService } from '../../../../../../../navigation/navigation-service';
import { AccountStats } from '../../../../../../../core/blockchain/types/stats';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
}

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

interface IState {
    accountStats: AccountStats;
}

export class AccountTabComponent extends React.Component<
    IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            accountStats: undefined
        };
    }
    public componentDidMount() {
        const blockchainInstance = getBlockchain(this.props.blockchain);
        blockchainInstance
            .getStats(this.props.chainId)
            .getAccountDelegateStats()
            .then(accStats => {
                this.setState({ accountStats: accStats });
            })
            .catch();
    }

    public render() {
        const styles = this.props.styles;

        const blockchainInstance = getBlockchain(this.props.blockchain);
        const tokenUiConfig = blockchainInstance.config.ui.token;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <AccountAddress account={this.props.account} token={this.props.token} />
                    {this.state.accountStats && (
                        <StatsComponent accountStats={this.state.accountStats} />
                    )}
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.buttonsRowContainer}>
                        <Button
                            key={`cta-send`}
                            style={styles.button}
                            wrapperStyle={{ flex: 1 }}
                            leftIcon={'arrow-right'}
                            onPress={() =>
                                NavigationService.navigate('Send', {
                                    accountIndex: this.props.account.index,
                                    blockchain: this.props.account.blockchain,
                                    token: this.props.token
                                })
                            }
                        >
                            {translate('App.labels.send')}
                        </Button>
                        <Button
                            key={`cta-receive`}
                            style={styles.button}
                            wrapperStyle={{ flex: 1 }}
                            leftIcon={'qr-code-scan'}
                            onPress={() =>
                                NavigationService.navigate('Receive', {
                                    accountIndex: this.props.account.index,
                                    blockchain: this.props.account.blockchain,
                                    token: this.props.token
                                })
                            }
                        >
                            {translate('App.labels.receive')}
                        </Button>
                    </View>
                    <CtaGroup mainCta={tokenUiConfig.accountCTA.mainCta} />
                </View>
            </View>
        );
    }
}

export const AccountTab = smartConnect<IProps>(AccountTabComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
