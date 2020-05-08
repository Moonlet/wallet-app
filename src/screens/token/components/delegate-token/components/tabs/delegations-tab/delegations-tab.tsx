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
import { IValidatorCardComponent } from '../../../../../../../core/blockchain/types/stats';

const validators = [moonletValidator, chainLayerValidator, chainLayerValidator];

interface IState {
    validatorsList: IValidatorCardComponent[];
}

export class DelegationsTabComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
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
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <SearchInput
                        placeholderText={translate('Token.searchValidators')}
                        onChangeText={this.onSearchInput}
                        onClose={this.onClose}
                    />
                </View>
                <ValidatorsList validators={this.state.validatorsList} />
            </View>
        );
    }
}

export const DelegationsTab = smartConnect(DelegationsTabComponent, [withTheme(stylesProvider)]);
