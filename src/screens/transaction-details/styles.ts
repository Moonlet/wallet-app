import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingTop: 40,
            paddingBottom: BASE_DIMENSION * 2,
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: 6
        },
        icon: {
            color: theme.colors.accent,
            marginHorizontal: 0
        },
        textRow: {
            fontSize: 16,
            alignItems: 'center',
            lineHeight: 30
        },
        rightContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            paddingRight: 8
        }
    });
