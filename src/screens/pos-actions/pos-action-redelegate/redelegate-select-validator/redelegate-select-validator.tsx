import React from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import {
    withNavigationParams,
    INavigationProps
} from '../../../../navigation/with-navigation-params';
import { getAccount } from '../../../../redux/wallets/selectors';
import { Blockchain, ChainIdType } from '../../../../core/blockchain/types';
import BigNumber from 'bignumber.js';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { TestnetBadge } from '../../../../components/testnet-badge/testnet-badge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { HeaderStepByStep } from '../../../send/components/header-step-by-step/header-step-by-step';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IValidator, CardActionType } from '../../../../core/blockchain/types/stats';
import { ValidatorsList } from '../../../token/components/delegate-token/components/validators/validators-list/validators-list';
import { bind } from 'bind-decorator';
import { BottomCta } from '../../../../components/bottom-cta/bottom-cta';
import { PrimaryCtaField } from '../../../../components/bottom-cta/primary-cta-field/primary-cta-field';
import { AmountCtaField } from '../../../../components/bottom-cta/amount-cta-field/amount-cta-field';
import {
    navigateToEnterAmountStep,
    REDELEGATE_ENTER_AMOUNT
} from '../../../../redux/ui/screens/posActions/actions';
import { ValidatorCard } from '../../../token/components/delegate-token/components/validators/validator-card/validator-card';
import { formatNumber } from '../../../../core/utils/format-number';
import { getValidators } from '../../../../redux/ui/validators/selectors';
import { formatValidatorName } from '../../../../core/utils/format-string';
import { Dialog } from '../../../../components/dialog/dialog';
import { PosBasicActionType } from '../../../../core/blockchain/types/token';

interface IHeaderStep {
    step: number;
    title: string;
    active: boolean;
}

interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    allValidators: IValidator[];
    navigateToEnterAmountStep: typeof navigateToEnterAmountStep;
}

interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
}

interface IState {
    headerSteps: IHeaderStep[];
    nrValidators: number;
    validatorsList: IValidator[];
    fromValidator: IValidator;
}

const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    const chainId = getChainId(state, ownProps.blockchain);

    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        chainId,
        allValidators: getValidators(state, ownProps.blockchain, chainId).filter(
            el => el.id !== ownProps.validators[0].id
        )
    };
};

const mapDispatchToProps = {
    navigateToEnterAmountStep
};

export const navigationOptions = ({ navigation }: any) => ({
    title: translate(navigation.state.params.actionText || 'App.labels.send')
});

export class RedelegateSelectValidatorComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
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

        const all = props.allValidators;
        Object.values(all).map(object => (object.actionTypeSelected = false));
        if (all.length) all[0].actionTypeSelected = true;
        this.state = {
            nrValidators: 1,
            headerSteps: stepList,
            validatorsList: all,
            fromValidator: props.validators.length ? props.validators[0] : undefined
        };
    }

    @bind
    public onSelect(validator: IValidator) {
        const validators = this.state.validatorsList;
        // unselect all validators
        Object.values(validators).map(object => (object.actionTypeSelected = false));
        this.setState({ validatorsList: validators }, () => {
            let selected = true;
            if (validator.actionTypeSelected) {
                selected = !validator.actionTypeSelected;
            }

            Object.values(validators).map(object => {
                if (validator.id === object.id) object.actionTypeSelected = selected;
            });
            this.setState({ validatorsList: validators });
        });
    }

    private renderValidatorList() {
        const { blockchain, token } = this.props;
        const blockchainInstance = getBlockchain(blockchain);
        const config = blockchainInstance.config;
        const validator = this.state.fromValidator;
        const tokenConfig = getTokenConfig(blockchain, token.symbol);

        return [
            <View key={'redelegate-validator-view'} style={this.props.styles.listContainer}>
                <ValidatorCard
                    key={'redelegate-validator'}
                    icon={validator.icon}
                    leftLabel={validator.name}
                    leftSmallLabel={validator.rank}
                    leftSubLabel={validator.website}
                    rightTitle={config.ui.validator.amountCardLabel}
                    rightSubtitle={formatNumber(
                        blockchainInstance.account.amountFromStd(
                            new BigNumber(validator.amountDelegated.active),
                            tokenConfig.decimals
                        ),
                        {
                            currency: blockchainInstance.config.coin
                        }
                    )}
                    actionType={CardActionType.DEFAULT}
                    bottomStats={validator.topStats}
                    actionTypeSelected={validator.actionTypeSelected || false}
                    borderColor={this.props.theme.colors.labelRedelegate}
                    onSelect={() => {
                        //
                    }}
                />
            </View>,
            <View key={'validator-list'} style={this.props.styles.listContainerValidators}>
                <ValidatorsList
                    validators={this.state.validatorsList}
                    blockchain={this.props.blockchain}
                    token={this.props.token}
                    redelegate={{
                        validator: this.props.validators[0],
                        color: this.props.theme.colors.labelRedelegate
                    }}
                    onSelect={this.onSelect}
                    actionType={CardActionType.CHECKBOX}
                />
            </View>
        ];
    }

    private renderBottomConfirm() {
        const tokenConfig = getTokenConfig(this.props.account.blockchain, this.props.token.symbol);

        const selectedValidators = this.state.validatorsList.filter(
            validator => validator.actionTypeSelected === true
        );

        const disableButton: boolean = selectedValidators.length === 0;

        return (
            <BottomCta
                label={translate('App.labels.next')}
                disabled={disableButton}
                onPress={() => {
                    // navigate to next screen
                    this.props.navigateToEnterAmountStep(
                        this.props.accountIndex,
                        this.props.blockchain,
                        this.props.token,
                        selectedValidators,
                        this.props.actionText,
                        'RedelegateEnterAmount',
                        REDELEGATE_ENTER_AMOUNT,
                        this.state.fromValidator
                    );
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.actionText)}
                    labelColor={this.props.theme.colors.labelRedelegate}
                    action={translate('App.labels.from').toLowerCase()}
                    value={formatValidatorName(this.state.fromValidator.name, 15)}
                />
                <AmountCtaField
                    tokenConfig={tokenConfig}
                    stdAmount={new BigNumber(0)}
                    account={this.props.account}
                />
            </BottomCta>
        );
    }

    async componentDidMount() {
        const performAction: { value: boolean; message: string } = await getBlockchain(
            this.props.blockchain
        )
            .getClient(this.props.chainId)
            .canPerformAction(PosBasicActionType.REDELEGATE, {
                account: this.props.account,
                validatorAddress: [this.state.fromValidator.id.toLowerCase()]
            });

        if (performAction && performAction.value === false) {
            Dialog.alert(
                translate('Validator.operationNotAvailable'),
                performAction.message,
                undefined,
                {
                    text: translate('App.labels.ok'),
                    onPress: () => this.props.navigation.goBack()
                }
            );
        }
    }

    public render() {
        const { styles } = this.props;
        const { headerSteps } = this.state;
        const config = getBlockchain(this.props.blockchain).config;

        return (
            <View style={styles.container}>
                <TestnetBadge />

                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={styles.content}>
                        <View style={styles.headerSteps}>
                            <HeaderStepByStep steps={headerSteps} />
                        </View>
                        {this.renderValidatorList()}
                    </View>
                </KeyboardAwareScrollView>
                {config.ui.token.actionScreenLabels[
                    PosBasicActionType.REDELEGATE.toLowerCase()
                ] && (
                    <Text style={styles.bottomText}>
                        {translate(
                            config.ui.token.actionScreenLabels[
                                PosBasicActionType.REDELEGATE.toLowerCase()
                            ]
                        )}
                    </Text>
                )}

                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const RedelegateSelectValidator = smartConnect(RedelegateSelectValidatorComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
