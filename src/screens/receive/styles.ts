import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 5,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        bottomButton: {
            width: '90%'
        },
        qrcode: {
            flex: 1,
            alignItems: 'center',
            padding: BASE_DIMENSION * 5
        },
        bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 3
        }
    });
