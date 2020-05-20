import React from 'react';
import { View } from 'react-native';
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

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    chainId: ChainIdType;
}

interface IState {
    validatorsFilteredList: IValidator[];
    unfilteredList: IValidator[];
}
let searchTimeoutTimer;

export class ValidatorsTabComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            validatorsFilteredList: [],
            unfilteredList: []
        };
    }

    public componentDidMount() {
        const blockchainInstance = getBlockchain(this.props.blockchain);
        blockchainInstance
            .getStats(this.props.chainId)
            .getValidatorList(CardActionType.NAVIGATE, -1)
            .then(validators => {
                this.setState({ validatorsFilteredList: validators, unfilteredList: validators });
            })
            .catch();
    }

    @bind
    public onSearchInput(text: string) {
        if (text.length > 2) {
            searchTimeoutTimer && clearTimeout(searchTimeoutTimer);
            searchTimeoutTimer = setTimeout(async () => {
                const filteredList = this.state.unfilteredList.filter(
                    validator => validator.name.toLowerCase().includes(text.toLowerCase()) === true
                );
                this.setState({ validatorsFilteredList: filteredList });
            }, 200);
        } else {
            // TODO - improvement to set state only when user deletes chars to set state once
            this.setState({
                validatorsFilteredList: this.state.unfilteredList
            });
        }
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
                    <ValidatorsList
                        validators={this.state.validatorsFilteredList}
                        blockchain={this.props.blockchain}
                        onSelect={this.onSelect}
                        actionType={CardActionType.NAVIGATE}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <CtaGroup mainCta={tokenUiConfig.accountCTA.mainCta} />
                </View>
            </View>
        );
    }
}

export const ValidatorsTab = smartConnect<IProps>(ValidatorsTabComponent, [
    withTheme(stylesProvider)
]);
