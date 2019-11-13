import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingTop: 40,
            paddingBottom: 18,
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        address: {
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 40
        },
        bottomButton: {
            width: '90%'
        },

        qrcode: {
            flex: 1,
            alignItems: 'center',
            padding: 40
        },
        bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 5
        }
    });
