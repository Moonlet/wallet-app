import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION / 2
        },
        exchangeCardContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginHorizontal: -BASE_DIMENSION / 2
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        addButton: {
            width: ICON_CONTAINER,
            height: ICON_CONTAINER,
            alignSelf: 'flex-end',
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION,
            marginTop: BASE_DIMENSION * 3
        }
    });
