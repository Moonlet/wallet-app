import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../../core/utils/smart-connect';
import {
    moonletValidator,
    chainLayerValidator
} from '../../../../../../../core/blockchain/cosmos/stats';
import { ValidatorsList } from '../../validators/validators-list/validators-list';
import { SearchInput } from '../../../../../../../components/search-input/search-input';
import { translate } from '../../../../../../../core/i18n';
import { bind } from 'bind-decorator';
import { IValidatorCard } from '../../../../../../../core/blockchain/types/stats';
// import { DelegationCTA } from '../../../../../../../components/delegation-cta/delegation-cta';
import { Blockchain } from '../../../../../../../core/blockchain/types';
import { CtaGroup } from '../../../../../../../components/cta-group/cta-group';
import { getBlockchain } from '../../../../../../../core/blockchain/blockchain-factory';

const validators = [chainLayerValidator, moonletValidator];

export interface IProps {
    blockchain: Blockchain;
}

interface IState {
    validatorsList: IValidatorCard[];
}

export class ValidatorsTabComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            validatorsList: validators
        };
    }

    @bind
    public onSearchInput(text: string) {
        const filteredList = validators.filter(
            validator => validator.labelName.toLowerCase().includes(text.toLowerCase()) === true
        );
        this.setState({ validatorsList: filteredList });
    }

    @bind
    public onClose() {
        this.setState({ validatorsList: validators });
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
                        validators={this.state.validatorsList}
                        blockchain={this.props.blockchain}
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
