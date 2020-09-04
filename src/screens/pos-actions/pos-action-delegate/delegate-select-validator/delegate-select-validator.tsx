import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
import { normalize } from '../../../../styles/dimensions';
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
    DELEGATE_ENTER_AMOUNT
} from '../../../../redux/ui/screens/posActions/actions';
import { Icon } from '../../../../components/icon/icon';
import { valuePrimaryCtaField } from '../../../../core/utils/format-string';
import { IconValues } from '../../../../components/icon/values';
import { getValidators } from '../../../../redux/ui/validators/selectors';

interface IHeaderStep {
    step: number;
    title: string;
    active: boolean;
}

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    allValidators: IValidator[];
    navigateToEnterAmountStep: typeof navigateToEnterAmountStep;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
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

export interface INavigationParams {
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
}

export const navigationOptions = ({ navigation }: any) => ({
    title: translate(navigation.state.params.actionText || 'App.labels.send')
});
export class DelegateSelectValidatorComponent extends React.Component<
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

        this.state = {
            nrValidators: 1,
            validatorsList: props.validators,
            headerSteps: stepList
        };
    }

    @bind
    public onSelect(validator: IValidator) {
        let selected = true;
        if (validator.actionTypeSelected) {
            selected = !validator.actionTypeSelected;
        }

        const validators = this.state.validatorsList;
        Object.values(validators).map(object => {
            if (validator.id === object.id) object.actionTypeSelected = selected;
        });
        this.setState({ validatorsList: validators });
    }

    private renderValidatorList() {
        const { styles } = this.props;
        const blockchainInstance = getBlockchain(this.props.blockchain);
        const maximumNumberOfValidatorsReached =
            blockchainInstance.config.ui.validator.maximumNumberOfValidators &&
            blockchainInstance.config.ui.validator.maximumNumberOfValidators <=
                this.state.nrValidators;
        return [
            <View key={'increase-list'} style={styles.actionContainer}>
                <TouchableOpacity
                    style={styles.actionIconContainer}
                    onPress={() => {
                        if (this.state.nrValidators > 1) {
                            const nrValidatorsNew = this.state.nrValidators - 1;

                            const aditionalValidators = this.props.allValidators.slice(
                                0,
                                nrValidatorsNew - 1
                            );
                            this.setState({
                                nrValidators: nrValidatorsNew,
                                validatorsList: this.props.validators.concat(aditionalValidators)
                            });
                        }
                        // decrease
                    }}
                >
                    <Icon name={IconValues.MINUS} size={normalize(16)} style={styles.actionIcon} />
                </TouchableOpacity>
                <Text style={styles.actionCounterText}>{this.state.nrValidators}</Text>
                <TouchableOpacity
                    style={styles.actionIconContainer}
                    onPress={() => {
                        if (
                            this.props.allValidators.length >= this.state.nrValidators &&
                            !maximumNumberOfValidatorsReached
                        ) {
                            const nrValidatorsNew = this.state.nrValidators + 1;

                            const aditionalValidators =
                                this.props.allValidators.length > nrValidatorsNew - 1
                                    ? this.props.allValidators.slice(0, nrValidatorsNew - 1)
                                    : this.props.allValidators;

                            this.setState({
                                nrValidators: nrValidatorsNew,
                                validatorsList: this.props.validators.concat(aditionalValidators)
                            });
                        }
                        // increase
                    }}
                >
                    <Icon name={IconValues.PLUS} size={normalize(16)} style={styles.actionIcon} />
                </TouchableOpacity>
            </View>,
            <View key={'validator-list'} style={this.props.styles.listContainer}>
                <ValidatorsList
                    validators={this.state.validatorsList}
                    blockchain={this.props.blockchain}
                    token={this.props.token}
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
                        'DelegateEnterAmount',
                        DELEGATE_ENTER_AMOUNT
                    );
                }}
            >
                <PrimaryCtaField
                    label={translate(this.props.actionText)}
                    action={translate('App.labels.for').toLowerCase()}
                    value={valuePrimaryCtaField(this.state.validatorsList)}
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
        const { styles } = this.props;
        const { headerSteps } = this.state;

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

                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const DelegateSelectValidator = smartConnect(DelegateSelectValidatorComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
