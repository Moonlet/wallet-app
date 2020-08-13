import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';
import { ph, pw } from '../../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION * 7
        },
        moonletImage: {
            height: ph(20),
            width: pw(50),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginVertical: BASE_DIMENSION * 6
        },
        chooseUsernameText: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 5,
            marginHorizontal: BASE_DIMENSION * 6
        },
        createButton: {
            marginHorizontal: BASE_DIMENSION * 2
        },
        domain: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text,
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignSelf: 'center'
        },
        inputBox: {
            height: BASE_DIMENSION * 5 + BASE_DIMENSION / 2,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION / 2
        },
        inputText: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(17)
        },
        infoText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20)
        },
        checkingText: {
            color: theme.colors.error
        },
        errorText: {
            color: theme.colors.negative
        },
        congratsText: {
            color: theme.colors.accent
        },

        // TODO

        invalidText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.error
        },

        inputContainer: {
            marginBottom: BASE_DIMENSION * 4
        },
        // inputBox: {
        //     height: BASE_DIMENSION * 5,
        //     borderRadius: BORDER_RADIUS,
        //     alignSelf: 'stretch',
        //     backgroundColor: theme.colors.cardBackground,
        //     paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
        //     flexDirection: 'row',
        //     justifyContent: 'space-between',
        //     alignItems: 'center'
        // },
        // input: {
        //     flex: 1,
        //     color: theme.colors.text,
        //     fontSize: normalizeFontAndLineHeight(15)
        // },
        icon: {
            color: theme.colors.accent
        }
    });
