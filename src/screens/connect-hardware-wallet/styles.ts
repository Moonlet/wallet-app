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
            marginBottom: 10
        },

        bottomButton: {
            width: '80%'
        },
        textIndicator: {
            fontSize: theme.fontSize.regular,
            textAlign: 'center',
            color: theme.colors.text,
            marginBottom: 10
        },
        text: {
            fontSize: theme.fontSize.regular,
            color: theme.colors.text,
            marginBottom: 10
        }
    });
