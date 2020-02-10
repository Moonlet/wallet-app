import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { pw } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            backgroundColor: theme.colors.appBackground,
            height: '100%',
            width: '100%',
            justifyContent: 'center'
        },
        image: {
            width: pw(60),
            resizeMode: 'contain',
            alignSelf: 'center'
        }
    });
