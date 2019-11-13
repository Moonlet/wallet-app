import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            padding: 0,
            paddingTop: 10,
            alignItems: 'center',
            alignSelf: 'stretch',
            flex: 1,
            marginBottom: BASE_DIMENSION / 2
        },
        exchangeCardContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginHorizontal: -BASE_DIMENSION / 2
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
