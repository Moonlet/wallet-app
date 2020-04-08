import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';
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
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginHorizontal: BASE_DIMENSION * 2
        },
        scanButton: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 4
        }
    });
