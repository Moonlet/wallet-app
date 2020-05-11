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
import { DelegationCTA } from '../../../../../../../components/delegation-cta/delegation-cta';
import { Button } from '../../../../../../../library';
import { IButtonCTA } from '../../../../../../../core/blockchain/types/token';
import { translate } from '../../../../../../../core/i18n';
import { NavigationService } from '../../../../../../../navigation/navigation-service';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    extensionTransactionPayload: any; // TODO add typing
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

export class AccountTabComponent extends React.Component<
    IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const styles = this.props.styles;

        const blockchainInstance = getBlockchain(this.props.blockchain);
        const stats = blockchainInstance.getStats(this.props.chainId);

        const accountStats = stats.getAccountDelegateStats();
        const tokenUiConfig = blockchainInstance.config.ui.token;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <AccountAddress account={this.props.account} token={this.props.token} />
                    <StatsComponent accountStats={accountStats} />
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.buttonsRowContainer}>
                        {tokenUiConfig.accountCTA.otherCta.map((cta: IButtonCTA, index: number) => (
                            <Button
                                key={`cta-${index}`}
                                style={styles.button}
                                wrapperStyle={{ flex: 1 }}
                                leftIcon={cta.iconName}
                                onPress={() =>
                                    NavigationService.navigate(
                                        cta.navigateTo.screen,
                                        cta.navigateTo.params
                                    )
                                }
                            >
                                {translate(cta.title)}
                            </Button>
                        ))}
                    </View>
                    <DelegationCTA mainCta={tokenUiConfig.accountCTA.mainCta} />
                </View>
            </View>
        );
    }
}

export const AccountTab = smartConnect<IProps>(AccountTabComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
