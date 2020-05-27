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
import { ConfirmComponent } from '../../components/confirm-component/confirm-component';

interface IHeaderStep {
    step: number;
    title: string;
    active: boolean;
}

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
    amount: string;
}

export const mapStateToProps = (state: IReduxState) => {
    const accountIndex = state.ui.screens.posActions.quickDelegateConfirm.accountIndex;
    const blockchain = state.ui.screens.posActions.quickDelegateConfirm.blockchain;
    return {
        account: getAccount(state, accountIndex, blockchain),
        chainId: getChainId(state, blockchain),
        accountIndex,
        blockchain,
        token: state.ui.screens.posActions.quickDelegateConfirm.token,
        validators: state.ui.screens.posActions.quickDelegateConfirm.validators,
        actionText: state.ui.screens.posActions.quickDelegateConfirm.actionText,
        amount: state.ui.screens.posActions.quickDelegateConfirm.amount
    };
};

const mapDispatchToProps = {
    //
};

interface IState {
    headerSteps: IHeaderStep[];
    validatorsList: IValidator[];
    amount: string;
    feeOptions: IFeeOptions;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: navigation?.state?.params?.actionText && translate(navigation?.state?.params?.actionText)
});

export class QuickDelegateConfirmComponent extends React.Component<
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
                active: index === 2 ? true : false
            });
        });

        this.state = {
            headerSteps: stepList,
            validatorsList: props.validators,
            amount: props.amount,
            feeOptions: undefined
        };
    }

    public componentDidMount() {
        this.props.navigation.setParams({ actionText: this.props.actionText });
    }

    public onPressConfirm() {
        // on press confirm
    }

    public render() {
        return (
            <ConfirmComponent
                account={this.props.account}
                chainId={this.props.chainId}
                token={this.props.token}
                validators={this.props.validators}
                actionText={this.props.actionText}
                amount={this.state.amount}
                showSteps={false}
                feeOptions={this.state.feeOptions}
                onPressConfirm={() => this.onPressConfirm()}
            />
        );
    }
}

export const QuickDelegateConfirm = smartConnect(QuickDelegateConfirmComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
