import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.appBackground,
            height: '100%'
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
            marginBottom: BASE_DIMENSION * 6
        },

        mnemonicContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 6,
            alignSelf: 'stretch',
            padding: 12,
            marginTop: 20
        },

        mnemonicLine: {
            flexDirection: 'row',
            paddingVertical: 8
        },

        mnemonicWord: {
            flexBasis: 0,
            flex: 1
        },

        bottomButton: {
            width: '80%'
        },

        textContainer: {
            flexDirection: 'row',
            marginTop: BASE_DIMENSION * 3,
            marginHorizontal: BASE_DIMENSION * 2
        },

        alertIcon: {
            color: theme.colors.warning,
            marginRight: BASE_DIMENSION
        }
    });
