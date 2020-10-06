import React from 'react';
import { View, Image, Text } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import { ValidatorsList } from '../../validators/validators-list/validators-list';
import { SearchInput } from '../../../../../../../components/search-input/search-input';
import { translate } from '../../../../../../../core/i18n';
import { bind } from 'bind-decorator';
import { IValidator, CardActionType } from '../../../../../../../core/blockchain/types/stats';
import { Blockchain, ChainIdType } from '../../../../../../../core/blockchain/types';
import { CtaGroup } from '../../../../../../../components/cta-group/cta-group';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';
import { NavigationService } from '../../../../../../../navigation/navigation-service';
import { ITokenState } from '../../../../../../../redux/wallets/state';
import { IReduxState } from '../../../../../../../redux/state';
import { getValidators } from '../../../../../../../redux/ui/validators/selectors';
import { LoadingIndicator } from '../../../../../../../components/loading-indicator/loading-indicator';
import { connect } from 'react-redux';

interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    chainId: ChainIdType;
}

interface IReduxProps {
    validators: IValidator[];
}

const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
    return {
        validators: getValidators(state, ownProps.blockchain, ownProps.chainId)
    };
};

interface IState {
    validatorsFilteredList: IValidator[];
    unfilteredList: IValidator[];
}

export class ValidatorsTabComponent extends React.Component<
    IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    private searchTimeoutTimer;

    constructor(props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            validatorsFilteredList: this.props.validators,
            unfilteredList: this.props.validators
        };
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.validators !== prevProps.validators) {
            this.setState({
                validatorsFilteredList: this.props.validators,
                unfilteredList: this.props.validators
            });
        }
    }

    @bind
    public onSearchInput(text: string) {
        this.searchTimeoutTimer && clearTimeout(this.searchTimeoutTimer);
        this.searchTimeoutTimer = setTimeout(async () => {
            const filteredList = this.state.unfilteredList.filter(
                validator => validator.name.toLowerCase().includes(text.toLowerCase()) === true
            );
            this.setState({ validatorsFilteredList: filteredList });
        }, 200);
    }

    @bind
    public onClose() {
        this.setState({
            validatorsFilteredList: this.state.unfilteredList
        });
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
        const { styles } = this.props;
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
                    {!this.state.validatorsFilteredList && (
                        <View style={{ flex: 1 }}>
                            <LoadingIndicator />
                        </View>
                    )}
                    {this.state.validatorsFilteredList?.length === 0 ? (
                        <View style={styles.emptySection}>
                            <Image
                                style={styles.logoImage}
                                source={require('../../../../../../../assets/images/png/moonlet_space_gray.png')}
                            />
                            <Text style={styles.noNodesText}>{translate('Validator.noNodes')}</Text>
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

export const ValidatorsTab = smartConnect<IProps>(ValidatorsTabComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
