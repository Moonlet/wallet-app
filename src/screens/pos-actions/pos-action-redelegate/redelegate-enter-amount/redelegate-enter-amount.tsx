import React from 'react';
import { IReduxState } from '../../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../../core/i18n';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';

import { getAccount } from '../../../../redux/wallets/selectors';
import { Blockchain, ChainIdType, IFeeOptions } from '../../../../core/blockchain/types';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import {
    navigateToConfirmationStep,
    REDELEGATE_CONFIRMATION
} from '../../../../redux/ui/screens/posActions/actions';
import { EnterAmountComponent } from '../../components/enter-amount-component/enter-amount-component';
import bind from 'bind-decorator';
import BigNumber from 'bignumber.js';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    navigateToConfirmationStep: typeof navigateToConfirmationStep;
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    fromValidator: IValidator;
    actionText: string;
}

export const mapStateToProps = (state: IReduxState) => {
    const accountIndex = state.ui.screens.posActions.redelegateEnterAmount.accountIndex;
    const blockchain = state.ui.screens.posActions.redelegateEnterAmount.blockchain;
    return {
        account: getAccount(state, accountIndex, blockchain),
        chainId: getChainId(state, blockchain),
        accountIndex,
        blockchain,
        token: state.ui.screens.posActions.redelegateEnterAmount.token,
        validators: state.ui.screens.posActions.redelegateEnterAmount.validators,
        actionText: state.ui.screens.posActions.redelegateEnterAmount.actionText,
        fromValidator: state.ui.screens.posActions.redelegateEnterAmount.fromValidator
    };
};

const mapDispatchToProps = {
    navigateToConfirmationStep
};

interface IState {
    amount: string;
    minimumDelegateAmount: BigNumber;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: navigation?.state?.params?.actionText && translate(navigation?.state?.params?.actionText)
});

export class RedelegateEnterAmountComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        const blockchainInstance = getBlockchain(props.account.blockchain);

        const stepList = [];
        blockchainInstance.config.ui.token.sendStepLabels.map((step, index) => {
            stepList.push({
                step: index,
                title: translate(step),
                active: index === 1 ? true : false
            });
        });

        const amountFromValidator = props.fromValidator
            ? new BigNumber(props.fromValidator.amountDelegated.active)
                  .plus(props.fromValidator.amountDelegated.pending)
                  .toFixed()
            : '0';

        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        this.state = {
            minimumDelegateAmount: undefined,
            amount: blockchainInstance.account
                .amountFromStd(new BigNumber(amountFromValidator), tokenConfig.decimals)
                .toFixed()
        };
    }

    public async componentDidMount() {
        this.props.navigation.setParams({ actionText: this.props.actionText });
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const minimumDelegateAmountValue = await blockchainInstance
            .getClient(this.props.chainId)
            .getMinimumAmountDelegate();
        this.setState({
            minimumDelegateAmount: minimumDelegateAmountValue || new BigNumber(0)
        });
    }

    @bind
    public onPressNext(amount: string, feeOptions: IFeeOptions) {
        this.props.navigateToConfirmationStep(
            this.props.accountIndex,
            this.props.blockchain,
            this.props.token,
            this.props.validators,
            this.props.actionText,
            'RedelegateConfirm',
            REDELEGATE_CONFIRMATION,
            amount,
            feeOptions
        );
    }

    public render() {
        return (
            <EnterAmountComponent
                account={this.props.account}
                chainId={this.props.chainId}
                token={this.props.token}
                balanceForDelegate={this.state.amount}
                validators={this.props.validators}
                fromValidator={this.props.fromValidator}
                actionText={this.props.actionText}
                bottomColor={this.props.theme.colors.labelRedelegate}
                bottomActionText={'App.labels.from'}
                bottomButtonText={'App.labels.next'}
                showSteps={true}
                minimumDelegateAmount={this.state.minimumDelegateAmount}
                onPressNext={this.onPressNext}
            />
        );
    }
}
export const RedelegateEnterAmount = smartConnect(RedelegateEnterAmountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
