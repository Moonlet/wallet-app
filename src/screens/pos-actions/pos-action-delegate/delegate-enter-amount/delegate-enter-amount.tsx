import React from 'react';
import { IReduxState } from '../../../../redux/state';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../../core/i18n';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { IThemeProps, withTheme } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { getAccount } from '../../../../redux/wallets/selectors';
import { Blockchain, ChainIdType, IFeeOptions } from '../../../../core/blockchain/types';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import {
    DELEGATE_CONFIRMATION,
    navigateToConfirmationStep
} from '../../../../redux/ui/screens/posActions/actions';
import { EnterAmountComponent } from '../../components/enter-amount-component/enter-amount-component';
import bind from 'bind-decorator';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import BigNumber from 'bignumber.js';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    navigateToConfirmationStep: typeof navigateToConfirmationStep;
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
}

export const mapStateToProps = (state: IReduxState) => {
    const accountIndex = state.ui.screens.posActions.delegateEnterAmount.accountIndex;
    const blockchain = state.ui.screens.posActions.delegateEnterAmount.blockchain;
    return {
        account: getAccount(state, accountIndex, blockchain),
        chainId: getChainId(state, blockchain),
        accountIndex,
        blockchain,
        token: state.ui.screens.posActions.delegateEnterAmount.token,
        validators: state.ui.screens.posActions.delegateEnterAmount.validators,
        actionText: state.ui.screens.posActions.delegateEnterAmount.actionText
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

export class DelegateEnterAmountComponent extends React.Component<
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

        this.state = {
            amount: undefined,
            minimumDelegateAmount: undefined
        };
    }

    public async componentDidMount() {
        this.props.navigation.setParams({ actionText: this.props.actionText });

        const blockchainInstance = getBlockchain(this.props.blockchain);
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);

        try {
            const data = await blockchainInstance
                .getStats(this.props.chainId)
                .getAvailableBalanceForDelegate(this.props.account);

            const response = await blockchainInstance
                .getClient(this.props.chainId)
                .getMinimumAmountDelegate();

            const minimumDelegateAmountValue = blockchainInstance.account.amountFromStd(
                new BigNumber(response),
                tokenConfig.decimals
            );

            this.setState({
                amount: blockchainInstance.account
                    .amountFromStd(new BigNumber(data), tokenConfig.decimals)
                    .toFixed(),
                minimumDelegateAmount:
                    minimumDelegateAmountValue.multipliedBy(this.props.validators.length) ||
                    new BigNumber(0)
            });
        } catch (err) {
            this.setState({ amount: this.props.token.balance.value }); // set balance to the available balance at least
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    @bind
    public onPressNext(amount: string, feeOptions: IFeeOptions) {
        this.props.navigateToConfirmationStep(
            this.props.accountIndex,
            this.props.blockchain,
            this.props.token,
            this.props.validators,
            this.props.actionText,
            'DelegateConfirm',
            DELEGATE_CONFIRMATION,
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
                actionText={this.props.actionText}
                bottomColor={this.props.theme.colors.accent}
                bottomActionText={'App.labels.for'}
                bottomButtonText={'App.labels.next'}
                showSteps={true}
                minimumDelegateAmount={this.state.minimumDelegateAmount}
                onPressNext={this.onPressNext}
            />
        );
    }
}
export const DelegateEnterAmount = smartConnect(DelegateEnterAmountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
