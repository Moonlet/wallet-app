import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground,
            height: '100%'
        },
        configContainer: {
            flex: 1
        },
        connectionContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        activityContainer: {
            marginBottom: BASE_DIMENSION * 2,
            alignItems: 'center'
        },
        bottomContainer: {
            flex: 0,
            justifyContent: 'center',
            alignSelf: 'stretch',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 5
        },
        bottomButton: {
            width: '80%'
        },
        textIndicator: {
            width: '90%',
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 2
        },
        text: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.text
        },
        headerRow: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: BASE_DIMENSION * 4
        },
        headerDescription: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: BASE_DIMENSION * 4
        },
        circle: {
            height: normalize(50),
            width: normalize(50),
            borderRadius: normalize(25),
            padding: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            alignSelf: 'center',
            backgroundColor: theme.colors.cardBackground
        },
        circleSelected: {
            backgroundColor: theme.colors.accentSecondary
        },
        number: {
            fontSize: normalizeFontAndLineHeight(28),
            lineHeight: normalizeFontAndLineHeight(34),
            textAlign: 'center',
            color: theme.colors.textSecondary
        },
        numberSelected: {
            color: theme.colors.accent
        },
        divider: {
            flex: 1,
            height: 2,
            alignSelf: 'center',
            backgroundColor: theme.colors.cardBackground
        },
        dividerSelected: {
            backgroundColor: theme.colors.accentSecondary
        }
    });
