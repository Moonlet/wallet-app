import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { translate } from '../../../../core/i18n';
import { Button } from '../../../../library';
import { NavigationService } from '../../../../navigation/navigation-service';
import { BASE_DIMENSION } from '../../../../styles/dimensions';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { connect } from 'react-redux';
import { Blockchain, ChainIdType } from '../../../../core/blockchain/types';
import { IReduxState } from '../../../../redux/state';
import { getSelectedBlockchain, getSelectedAccount } from '../../../../redux/wallets/selectors';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { getChainId } from '../../../../redux/preferences/selectors';
import { DraggableCardWithCheckbox } from '../../../../components/draggable-card-with-check-box/draggable-card-with-check-box';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { Amount } from '../../../../components/amount/amount';

interface IReduxProps {
    account: IAccountState;
    blockchain: Blockchain;
    chainId: ChainIdType;
}

const mapStateToProps = (state: IReduxState) => {
    const blockchain = getSelectedBlockchain(state);

    return {
        blockchain,
        account: getSelectedAccount(state),
        chainId: getChainId(state, blockchain)
    };
};

export const navigationOptions = () => ({
    title: translate('App.labels.addToken')
});

export class AddTokenScreenComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {this.props.account?.tokens &&
                        this.props.chainId &&
                        Object.values(this.props.account.tokens[this.props.chainId]).map(
                            (token: ITokenState, index: number) => {
                                const tokenConfig = getTokenConfig(
                                    this.props.account.blockchain,
                                    token.symbol
                                );

                                return (
                                    <DraggableCardWithCheckbox
                                        key={`token-${index}`}
                                        mainText={
                                            <Amount
                                                style={styles.amountText}
                                                token={token.symbol}
                                                tokenDecimals={tokenConfig.decimals}
                                                amount={token.balance?.value}
                                                blockchain={this.props.blockchain}
                                            />
                                        }
                                        subtitleText={
                                            <Amount
                                                style={styles.amountConvertedText}
                                                token={token.symbol}
                                                tokenDecimals={tokenConfig.decimals}
                                                amount={token.balance?.value}
                                                blockchain={this.props.blockchain}
                                                convert
                                            />
                                        }
                                        isActive={true}
                                        onPressCheckBox={() => {
                                            // TODO
                                        }}
                                        onLongPress={() => {
                                            // TODO
                                        }}
                                        imageIcon={tokenConfig.icon}
                                    />
                                );
                            }
                        )}
                </View>
                <Button
                    primary
                    onPress={() => NavigationService.navigate('ManageToken', {})}
                    wrapperStyle={{ marginHorizontal: BASE_DIMENSION * 2 }}
                    disabled={!getBlockchain(this.props.blockchain).config.ui.enableTokenManagement}
                >
                    {translate('App.labels.addToken')}
                </Button>
            </View>
        );
    }
}

export const AddTokenScreen = smartConnect(AddTokenScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
