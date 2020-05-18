import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';
import { pw, ph } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION * 2
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        moonletImage: {
            height: ph(30),
            width: pw(60),
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: BASE_DIMENSION * 10
        },
        quicklyConnectText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginHorizontal: BASE_DIMENSION * 2
        },
        scanButton: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 4
        },
        connectionsContainer: {
            flex: 1,
            flexDirection: 'column'
        },
        connectionBox: {
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
            flexDirection: 'column'
        },
        connectionInfoText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION
        },
        flashIcon: {
            alignSelf: 'center',
            color: theme.colors.error
        },
        extraInfoContainer: {
            flexDirection: 'row',
            paddingTop: BASE_DIMENSION / 4
        },
        extraInfo: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.textTertiary,
            marginRight: BASE_DIMENSION / 2
        }
    });
