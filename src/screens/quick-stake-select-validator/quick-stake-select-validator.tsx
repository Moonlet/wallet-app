import React from 'react';
import { View, ScrollView } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { translate } from '../../core/i18n';
import { SmartScreen } from '../smart-screen/smart-screen';
import { ContextScreen } from '../../components/widgets/types';
import { BottomCta } from '../../components/bottom-cta/bottom-cta';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { getChainId } from '../../redux/preferences/selectors';
import { getScreenDataKey } from '../../redux/ui/screens/data/reducer';
import { buildDummyValidator } from '../../redux/wallets/actions';
import {
    navigateToEnterAmountStep,
    QUICK_DELEGATE_ENTER_AMOUNT
} from '../../redux/ui/screens/posActions/actions';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

interface IReduxProps {
    validators: {
        id: string;
        name: string;
    }[];
    account: IAccountState;
    token: ITokenState;
    navigateToEnterAmountStep: typeof navigateToEnterAmountStep;
}

const mapStateToProps = (state: IReduxState) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        tab: undefined
    });

    return {
        validators: state.ui.screens.inputData[screenKey]?.validators || [],
        account,
        token: account.tokens[chainId][getBlockchain(account.blockchain).config.coin]
    };
};

const mapDispatchToProps = {
    navigateToEnterAmountStep
};

const navigationOptions = () => ({ title: translate('App.labels.quickStake') });

class QuickStakeSelectValidatorScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
    }

    private renderBottomConfirm() {
        const { validators } = this.props;

        return (
            <BottomCta
                label={translate('App.labels.next')}
                disabled={false} // this.props.validators.length === 0}
                onPress={() => {
                    const selectedValidators = [];
                    for (const v of validators) {
                        selectedValidators.push(buildDummyValidator(v.id, v.name));
                    }
                    // Navigate to enter amount step
                    this.props.navigateToEnterAmountStep(
                        this.props.account.index,
                        this.props.account.blockchain,
                        this.props.token,
                        selectedValidators,
                        'App.labels.quickStake',
                        'QuickDelegateEnterAmount',
                        QUICK_DELEGATE_ENTER_AMOUNT
                    );
                }}
            >
                {/* TODO: this.props.validators not working */}
                {/* <PrimaryCtaField
                    label={translate('App.labels.quickStake')}
                    action={translate('App.labels.for').toLowerCase()}
                    value={undefined}
                    // value={valuePrimaryCtaField(this.state.validatorsList)}
                /> */}
            </BottomCta>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <SmartScreen
                        context={{
                            screen: ContextScreen.QUICK_STAKE_SELECT_VALIDATOR
                        }}
                    />
                </ScrollView>
                {this.renderBottomConfirm()}
            </View>
        );
    }
}

export const QuickStakeSelectValidatorScreen = smartConnect(
    QuickStakeSelectValidatorScreenComponent,
    [connect(mapStateToProps, mapDispatchToProps), withTheme(stylesProvider)]
);
