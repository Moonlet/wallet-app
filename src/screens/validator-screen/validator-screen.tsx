import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { CtaGroup } from '../../components/cta-group/cta-group';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { Blockchain } from '../../core/blockchain/types';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { SmartImage } from '../../library/image/smart-image';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { translate } from '../../core/i18n';
import { StatsComponent } from '../token/components/delegate-token/components/stats-component/stats-component';
import { IValidator, CardActionType } from '../../core/blockchain/types/stats';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import BigNumber from 'bignumber.js';
import { formatValidatorName } from '../../core/utils/format-string';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { IReduxState } from '../../redux/state';
import { getChainId } from '../../redux/preferences/selectors';
import {
    getValidators,
    getValidatorsLoading,
    getValidatorsTimestamp
} from '../../redux/ui/validators/selectors';
import { fetchValidators } from '../../redux/ui/validators/actions';
import { PosBasicActionType } from '../../core/blockchain/types/token';
import { getSelectedAccount } from '../../redux/wallets/selectors';

const ONE_HOUR = 60 * 60 * 1000; // ms

interface INavigationParams {
    validator: IValidator;
    blockchain: Blockchain;
    accountIndex: number;
    token: ITokenState;
    canPerformAction: boolean;
    options?: {
        validatorAddress: string;
        tokenSymbol: string;
    };
}

interface IReduxProps {
    account: IAccountState;
    chainId: string;
    reduxValidators: IValidator[];
    validatorsTimestamp: number;
    reduxValidatorsLoading: boolean;

    fetchValidators: typeof fetchValidators;
}

const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    const blockchain = ownProps.blockchain;
    const chainId = getChainId(state, blockchain);

    return {
        account: getSelectedAccount(state),
        chainId,
        reduxValidators: getValidators(state, blockchain, chainId),
        validatorsTimestamp: getValidatorsTimestamp(state, blockchain, chainId),
        reduxValidatorsLoading: getValidatorsLoading(state, blockchain, chainId)
    };
};

const mapDispatchToProps = {
    fetchValidators
};

interface IState {
    validator: IValidator;
    token: ITokenState;
}

const HeaderTitleComponent = (
    props: INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const validator = props.navigation.state.params.validator;

    if (validator) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <SmartImage source={{ uri: validator.icon }} style={props.styles.navigationImage} />
                <View style={{ flexDirection: 'column' }}>
                    <Text style={props.styles.labelName}>
                        {formatValidatorName(validator.name, 15)}
                    </Text>
                    <Text style={props.styles.website}>{validator.website}</Text>
                </View>
            </View>
        );
    } else {
        return <View />;
    }
};

const HeaderTitle = withTheme(stylesProvider)(HeaderTitleComponent);

const navigationOptions = ({ navigation }: any) => ({
    headerTitle: () => <HeaderTitle navigation={navigation} />
});

class ValidatorScreenComponent extends React.Component<
    INavigationParams &
        IReduxProps &
        INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationParams &
            IReduxProps &
            INavigationProps<INavigationParams> &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            validator: undefined,
            token: undefined
        };
    }

    public componentDidMount() {
        if (this.props.token) {
            this.setState({ token: this.props.token });
        }

        if (this.props.validator) {
            this.setState({ validator: this.props.validator });
        } else {
            const validator = this.findValidator();

            if (
                !validator ||
                new Date().getTime() - new Date(this.props.validatorsTimestamp).getTime() > ONE_HOUR
            ) {
                this.props.fetchValidators(this.props.account, PosBasicActionType.DELEGATE);
                // this.props.fetchDelegatedValidators(this.props.account);
            } else if (validator) {
                this.setState({ validator });
                this.props.navigation.setParams({ validator });
            }
        }
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.reduxValidators !== prevProps.reduxValidators) {
            const validator = this.findValidator();
            if (validator) {
                this.setState({ validator });
                this.props.navigation.setParams({ validator });
            }
        }
    }

    private findValidator(): IValidator {
        const validators = this.props.reduxValidators;

        if (
            validators &&
            Array.isArray(validators) &&
            validators.length > 0 &&
            this.props.options
        ) {
            return validators.find(
                v => v.id.toLowerCase() === this.props.options.validatorAddress.toLowerCase()
            );
        }

        if (!this.state.token && this.props.options?.tokenSymbol) {
            const token = this.props.account.tokens[this.props.chainId][
                this.props.options.tokenSymbol
            ];
            if (token) this.setState({ token });
        }
    }

    public render() {
        const { blockchain, styles } = this.props;
        const { validator, token } = this.state;

        const config = getBlockchain(blockchain).config;

        if (!validator || this.props.reduxValidatorsLoading || !token) {
            return (
                <View style={styles.container}>
                    <LoadingIndicator />
                </View>
            );
        }

        const textTop =
            `${translate(config.ui.validator.totalLabel)}` +
            `${validator.rank ? ` (${validator.rank})` : ''}`;

        const amount = validator.totalVotes;
        const tokenConfig = getTokenConfig(blockchain, token.symbol);

        validator.actionType = CardActionType.CHECKBOX;
        validator.actionTypeSelected = true;

        const otherCtas = config.ui.token.validatorCTA.otherCtas;
        if (blockchain === Blockchain.ZILLIQA) {
            otherCtas.map(cta =>
                cta.title === 'App.labels.switchNode'
                    ? (cta.navigateTo.params.context = {
                          ...cta.navigateTo.params.context,
                          params: {
                              fromValidatorId: validator.id
                          }
                      })
                    : cta
            );
        }

        const mainCta = config.ui.token.validatorCTA.mainCta;
        mainCta.navigateTo.params = {
            ...mainCta.navigateTo.params,
            context: {
                ...mainCta.navigateTo.params?.context,
                params: {
                    ...mainCta.navigateTo.params?.context?.params,
                    validatorId: validator.id
                }
            }
        };

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.topText}>{textTop}</Text>
                    <Amount
                        style={styles.title}
                        amount={amount}
                        token={token.symbol}
                        tokenDecimals={tokenConfig.decimals}
                        blockchain={blockchain}
                        smallFontToken={{
                            visible: true,
                            wrapperStyle: {
                                marginVertical: BASE_DIMENSION
                            }
                        }}
                    />
                    <Amount
                        style={styles.subTitle}
                        amount={amount}
                        token={token.symbol}
                        tokenDecimals={tokenConfig.decimals}
                        blockchain={blockchain}
                        convert
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <StatsComponent
                        accountStats={{
                            topStats: validator.topStats,
                            chartStats: validator.chartStats,
                            secondaryStats: validator.secondaryStats,
                            totalAmount: new BigNumber(0),
                            widgets: []
                        }}
                        blockchain={this.props.blockchain}
                        token={token}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <CtaGroup
                        mainCta={mainCta}
                        otherCtas={otherCtas}
                        params={{
                            accountIndex: this.props.accountIndex,
                            blockchain: this.props.blockchain,
                            token,
                            validators: [validator],
                            canPerformAction: this.props.canPerformAction
                        }}
                    />
                </View>
            </View>
        );
    }
}

export const ValidatorScreen = smartConnect(ValidatorScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
