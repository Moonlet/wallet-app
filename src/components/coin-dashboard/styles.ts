import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            padding: 0,
            paddingTop: 10,
            alignItems: 'center',
            alignSelf: 'stretch',
            flex: 1,
            margin: 12,
            marginBottom: 4
        },
        exchangeCardContainer: {
            display: 'flex',
            flexDirection: 'row'
        },
        icon: {
            color: theme.colors.accent
        },
        addButton: {
            marginTop: 20,
            marginBottom: 12,
            alignSelf: 'flex-end',
            marginRight: 12
        }
    });
