import React from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../../library';
import { translate } from '../../../core/i18n';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { withNavigationParams, INavigationProps } from '../../../navigation/with-navigation-params';
import { getAccount } from '../../../redux/wallets/selectors';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';
import BigNumber from 'bignumber.js';
import { DelegationType } from '../../../core/blockchain/types/token';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { TestnetBadge } from '../../../components/testnet-badge/testnet-badge';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { getChainId } from '../../../redux/preferences/selectors';
import { IValidator } from '../../../core/blockchain/types/stats';
import { BottomCta } from '../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../components/bottom-cta/amount-cta-field/amount-cta-field';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    //
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    delegationType: DelegationType;
    validators: IValidator[];
    title: string;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: translate(navigation.state.params.title || 'App.labels.send')
});
export class PosActionSelectValidatorComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        const blockchainInstance = getBlockchain(props.account.blockchain);

        const stepList = [];
        blockchainInstance.config.ui.token.sendStepLabels.map((step, index) => {
            stepList.push({
                step: index,
                title: translate(step),
                active: index === 0 ? true : false
            });
        });

        this.state = {
            nrValidators: 1,
            headerSteps: stepList,
            validatorsList: props.validators
        };
    }

    private renderBottomConfirm() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        const disableButton: boolean = true;

        return (
            <BottomCta
                label={translate('App.labels.next')}
                disabled={disableButton}
                onPress={() => {
                    // navigate to next screen
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.title)}
                    action={translate('App.labels.from').toLowerCase()}
                    value={this.props.validators[0].name}
                />
                <AmountCtaField
                    tokenConfig={tokenConfig}
                    stdAmount={new BigNumber(0)}
                    account={this.props.account}
                />
            </BottomCta>
        );
    }

    public render() {
        const { styles, theme } = this.props;
        const map = [
            {
                text: translate('Validator.unlockText1')
            },
            {
                text: translate('Validator.unlockText2'),
                style: { color: theme.colors.notVoting }
            },
            {
                text: translate('Validator.unlockText3')
            },
            {
                text: translate('Validator.unlockText4'),
                style: { color: theme.colors.unlocking }
            },
            {
                text: translate('Validator.unlockText5')
            }
        ];

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={styles.content}>
                        <View>
                            return (
                            <View>
                                <Text style={styles.unlockContainerText}>
                                    {map.map((value, index) => {
                                        return (
                                            <Text
                                                key={index}
                                                style={[styles.unlockTextChildren, value?.style]}
                                            >
                                                {value.text + ' '}
                                            </Text>
                                        );
                                    })}
                                </Text>
                                {/* {this.renderEnterAmount()} */}
                            </View>
                            );
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const PosActionUndelegate = smartConnect(PosActionSelectValidatorComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
