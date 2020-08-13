import React from 'react';
import { IReduxState } from '../../../../redux/state';
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
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { delegate } from '../../../../redux/wallets/actions';
import { bind } from 'bind-decorator';

export interface IReduxProps {
    account: IAccountState;
    chainId: ChainIdType;
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    validators: IValidator[];
    actionText: string;
    amount: string;
    feeOptions: IFeeOptions;
    delegate: typeof delegate;
}

export const mapStateToProps = (state: IReduxState) => {
    const accountIndex = state.ui.screens.posActions.delegateConfirm.accountIndex;
    const blockchain = state.ui.screens.posActions.delegateConfirm.blockchain;
    return {
        account: getAccount(state, accountIndex, blockchain),
        chainId: getChainId(state, blockchain),
        accountIndex,
        blockchain,
        token: state.ui.screens.posActions.delegateConfirm.token,
        validators: state.ui.screens.posActions.delegateConfirm.validators,
        actionText: state.ui.screens.posActions.delegateConfirm.actionText,
        amount: state.ui.screens.posActions.delegateConfirm.amount,
        feeOptions: state.ui.screens.posActions.delegateConfirm.feeOptions
    };
};

const mapDispatchToProps = {
    delegate
};

export const navigationOptions = ({ navigation }: any) => ({
    title: navigation?.state?.params?.actionText && translate(navigation?.state?.params?.actionText)
});

export class DelegateConfirmComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
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
    }

    public componentDidMount() {
        this.props.navigation.setParams({ actionText: this.props.actionText });
    }

    @bind
    private async onPressConfirm(amount: string, feeOptions: IFeeOptions) {
        try {
            const password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );
            this.props.delegate(
                this.props.account,
                amount,
                this.props.validators,
                this.props.token.symbol,
                feeOptions,
                password,
                this.props.navigation,
                undefined
            );
            this.props.navigation.navigate('Token');
        } catch {
            //
        }
    }

    public render() {
        return (
            <ConfirmComponent
                account={this.props.account}
                chainId={this.props.chainId}
                token={this.props.token}
                validators={this.props.validators}
                actionText={this.props.actionText}
                amount={this.props.amount}
                bottomColor={this.props.theme.colors.accent}
                bottomActionText={'App.labels.for'}
                showSteps={true}
                feeOptions={this.props.feeOptions}
                onPressConfirm={this.onPressConfirm}
            />
        );
    }
}

export const DelegateConfirm = smartConnect(DelegateConfirmComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
