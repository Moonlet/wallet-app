import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../../../core/theme/with-theme';
import { Icon } from '../../../../components/icon';
import { ITheme } from '../../../../core/theme/itheme';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { IAccountState } from '../../../../redux/wallets/state';
import { formatAddress } from '../../../../core/utils/format-address';
import { ICON_SIZE } from '../../../../styles/dimensions';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    accounts: IAccountState[];
    onAccountSelection: (account: IAccountState) => any;
}

export class AccountListComponent extends React.Component<IProps & IExternalProps> {
    public render() {
        const styles = this.props.styles;
        const accounts = this.props.accounts;
        return (
            <ScrollView style={{ flex: 1, alignSelf: 'stretch' }}>
                {accounts &&
                    accounts.map((account: IAccountState, i: number) => (
                        <View key={i}>
                            <TouchableOpacity
                                key={i}
                                style={styles.rowContainer}
                                onPress={() => {
                                    this.props.onAccountSelection(account);
                                }}
                            >
                                <View>
                                    <Text style={styles.name}>Account {i + 1}</Text>
                                    <Text style={styles.address}>
                                        {formatAddress(account.address, account.blockchain)}
                                    </Text>
                                </View>
                                <Icon name="add-circle" size={ICON_SIZE} style={styles.icon} />
                            </TouchableOpacity>
                            <View style={styles.divider} />
                        </View>
                    ))}
            </ScrollView>
        );
    }
}

export const AccountList = smartConnect<IExternalProps>(AccountListComponent, [
    withTheme(stylesProvider)
]);
