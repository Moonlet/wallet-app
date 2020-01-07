import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground,
            height: '100%'
        },

        configContainer: {
            width: '100%'
        },
        connectionContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        activityContainer: {
            marginBottom: 10,
            alignItems: 'center'
        },
        bottomContainer: {
            flex: 0,
            justifyContent: 'center',
            alignSelf: 'stretch',
            alignItems: 'center',
            marginBottom: 40
        },

        bottomButton: {
            width: '80%'
        },
        textIndicator: {
            width: '90%',
            fontSize: theme.fontSize.regular,
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 2
        },
        text: {
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.text,
            opacity: 0.87
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
            height: 50,
            width: 50,
            borderRadius: 25,
            padding: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            alignSelf: 'center',
            backgroundColor: theme.colors.cardBackground
        },
        circleSelected: {
            backgroundColor: theme.colors.accent + '16'
        },
        number: {
            fontSize: 28,
            lineHeight: 34,
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
            backgroundColor: theme.colors.accent + 'AA'
        }
    });
