import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

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
            flexDirection: 'column',
            justifyContent: 'center'
        },
        bottomContainer: {
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center'
        },
        docImage: {
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
            fontSize: 17,
            lineHeight: 22,
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 10
        },
        text: {
            fontSize: 20,
            lineHeight: 25,
            color: theme.colors.text,
            letterSpacing: 0.38
        }
    });
