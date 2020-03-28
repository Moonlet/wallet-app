import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize, ICON_CONTAINER_SIZE } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION * 4
        },
        topContainer: {
            flex: 1,
            flexDirection: 'column'
        },
        bottomContainer: {
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center'
        },
        docImage: {
            flex: 1,
            alignSelf: 'center'
        },
        bottomButton: {
            width: '80%',
            marginTop: BASE_DIMENSION * 3
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION * 2,
            justifyContent: 'space-between',
            alignSelf: 'stretch'
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: theme.colors.settingsDivider
        },
        icon: {
            color: theme.colors.accent,
            fontWeight: 'bold',
            alignSelf: 'flex-end'
        },
        walletTc: {
            lineHeight: normalize(22),
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginTop: BASE_DIMENSION * 6
        },
        text: {
            lineHeight: normalize(25),
            color: theme.colors.text,
            letterSpacing: 0.38
        },
        iconContainer: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            justifyContent: 'center'
        },
        backIcon: {
            color: theme.colors.accent
        }
    });
