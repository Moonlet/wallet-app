import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { Text } from '../../../../../../library';
import { IThemeProps, withTheme } from '../../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../../core/utils/smart-connect';

export class DelegationsTabComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <Text style={styles.text}>Delegations</Text>
            </View>
        );
    }
}

export const DelegationsTab = smartConnect(DelegationsTabComponent, [withTheme(stylesProvider)]);
