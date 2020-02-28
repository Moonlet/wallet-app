import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.appBackground
        },
        topContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'stretch'
        },
        bottomContainer: {
            flex: 0,
            justifyContent: 'center',
            alignSelf: 'stretch',
            alignItems: 'center',
            marginTop: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 6
        },
        docImageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
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
            marginTop: BASE_DIMENSION * 6,
            marginBottom: BASE_DIMENSION * 2,
            fontSize: 17,
            lineHeight: 22,
            textAlign: 'center',
            color: theme.colors.textSecondary
        },
        text: {
            fontSize: 20,
            lineHeight: 25,
            color: theme.colors.text,
            letterSpacing: 0.38
        }
    });
