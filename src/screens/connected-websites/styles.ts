import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';
import { pw, ph } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 2 + BASE_DIMENSION / 2
        },
        topText: {
            fontSize: normalizeFontAndLineHeight(20),
            lineHeight: normalizeFontAndLineHeight(25),
            color: theme.colors.textSecondary,
            letterSpacing: LETTER_SPACING
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        moonletImage: {
            height: ph(30),
            width: pw(60),
            resizeMode: 'contain',
            alignSelf: 'center'
        },
        notConnectedText: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            color: theme.colors.textTertiary,
            textAlign: 'center'
        },
        connectionsContainer: {
            flex: 1,
            flexDirection: 'column',
            marginTop: BASE_DIMENSION * 2 + BASE_DIMENSION / 2
        },
        connectionRow: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION + BASE_DIMENSION / 2,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        computerIcon: {
            alignSelf: 'center',
            marginRight: BASE_DIMENSION * 3,
            color: theme.colors.text
        },
        connDetailscontainer: {
            flex: 1,
            flexDirection: 'column',
            paddingRight: BASE_DIMENSION
        },
        connectionInfoText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text
        },
        extraInfo: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.textTertiary
        },
        flashIcon: {
            alignSelf: 'center',
            color: theme.colors.error
        }
    });
