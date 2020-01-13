import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, SCREEN_HEIGHT, HEADER_FOR_WEB } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT
        },
        bottomButton: {
            width: '90%'
        },
        qrcode: {
            flex: 1,
            alignItems: 'center',
            //  padding: BASE_DIMENSION * 5,
            width: 300,
            height: 300
        },
        bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 3 + HEADER_FOR_WEB
        }
    });
