import React from 'react';
import { View, Image } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { ValidatorsList } from '../../validators/validators-list/validators-list';
import { SearchInput } from '../../../../../../../components/search-input/search-input';
import { translate } from '../../../../../../../core/i18n';
import { bind } from 'bind-decorator';
import { IValidator, CardActionType } from '../../../../../../../core/blockchain/types/stats';
import { Blockchain } from '../../../../../../../core/blockchain/types/blockchain';
import { CtaGroup } from '../../../../../../../components/cta-group/cta-group';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { NavigationService } from '../../../../../../../navigation/navigation-service';
import { ChainIdType } from '../../../../../../../core/blockchain/types';
import { ITokenState, IAccountState } from '../../../../../../../redux/wallets/state';
import { IReduxState } from '../../../../../../../redux/state';
import { connect } from 'react-redux';
import { getAccount } from '../../../../../../../redux/wallets/selectors';
import { LoadingIndicator } from '../../../../../../../components/loading-indicator/loading-indicator';
import { getDelegatedValidators } from '../../../../../../../redux/ui/delegated-validators/selectors';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    chainId: ChainIdType;
}

export interface IReduxProps {
    validators: IValidator[];
    account: IAccountState;
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        validators: getDelegatedValidators(state, ownProps.blockchain, ownProps.chainId)
    };
};

interface IState {
    validatorsFilteredList: IValidator[];
    unfilteredList: IValidator[];
    myValidatorsLoaded: boolean;
}
let searchTimeoutTimer: any;

export class DelegationsTabComponent extends React.Component<
    IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            validatorsFilteredList: this.props.validators || [],
            unfilteredList: this.props.validators || [],
            myValidatorsLoaded: true
        };
    }

    @bind
    public onSearchInput(text: string) {
        searchTimeoutTimer && clearTimeout(searchTimeoutTimer);
        searchTimeoutTimer = setTimeout(async () => {
            const filteredList = this.state.unfilteredList.filter(
                validator => validator.name.toLowerCase().includes(text.toLowerCase()) === true
            );
            this.setState({ validatorsFilteredList: filteredList });
        }, 200);
    }

    @bind
    public onClose() {
        this.setState({ validatorsFilteredList: this.state.unfilteredList });
    }
    @bind
    public onSelect(validator: IValidator) {
        NavigationService.navigate('Validator', {
            blockchain: this.props.blockchain,
            validator,
            accountIndex: this.props.accountIndex,
            token: this.props.token
        });
    }

    public render() {
        const styles = this.props.styles;
        const tokenUiConfig = getBlockchain(this.props.blockchain).config.ui.token;
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={styles.inputContainer}>
                        <SearchInput
                            placeholderText={translate('Token.searchValidators')}
                            onChangeText={this.onSearchInput}
                            onClose={this.onClose}
                        />
                    </View>
                    {!this.state.myValidatorsLoaded ? (
                        <LoadingIndicator />
                    ) : this.state.validatorsFilteredList.length === 0 ? (
                        <View style={styles.emptySection}>
                            <Image
                                style={styles.logoImage}
                                source={require('../../../../../../../assets/images/png/moonlet_space_gray.png')}
                            />
                        </View>
                    ) : (
                        <ValidatorsList
                            validators={this.state.validatorsFilteredList}
                            blockchain={this.props.blockchain}
                            token={this.props.token}
                            onSelect={this.onSelect}
                            actionType={CardActionType.NAVIGATE}
                        />
                    )}
                </View>
                <View style={styles.bottomContainer}>
                    <CtaGroup
                        mainCta={tokenUiConfig.accountCTA.mainCta}
                        params={{
                            accountIndex: this.props.accountIndex,
                            blockchain: this.props.blockchain,
                            token: this.props.token,
                            validators: []
                        }}
                    />
                </View>
            </View>
        );
    }
}

export const DelegationsTab = smartConnect<IProps>(DelegationsTabComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
