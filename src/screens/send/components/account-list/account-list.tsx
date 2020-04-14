import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Icon } from '../../../../components/icon';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { IAccountState } from '../../../../redux/wallets/state';
import { formatAddress } from '../../../../core/utils/format-address';
import { ICON_SIZE } from '../../../../styles/dimensions';

export interface IExternalProps {
    accounts: IAccountState[];
    onAccountSelection: (account: IAccountState) => any;
    selectedAddress: string;
}

export const AccountListComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { accounts, styles, selectedAddress } = props;

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            {accounts &&
                accounts.map((account: IAccountState, index: number) => {
                    const isSelected =
                        selectedAddress.toLowerCase() === account.address.toLowerCase();

                    return (
                        <View key={index}>
                            <TouchableOpacity
                                key={index}
                                style={styles.rowContainer}
                                onPress={() => props.onAccountSelection(account)}
                            >
                                <View>
                                    <Text style={[styles.name, isSelected && styles.selectedText]}>
                                        {`Account ${index + 1}`}
                                    </Text>
                                    <Text
                                        style={[styles.address, isSelected && styles.selectedText]}
                                    >
                                        {formatAddress(account.address, account.blockchain)}
                                    </Text>
                                </View>
                                <Icon
                                    name={isSelected ? 'check-1' : 'add-circle'}
                                    size={ICON_SIZE}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>

                            {index !== accounts.length - 1 && <View style={styles.divider} />}
                        </View>
                    );
                })}
        </ScrollView>
    );
};

export const AccountList = smartConnect<IExternalProps>(AccountListComponent, [
    withTheme(stylesProvider)
]);
