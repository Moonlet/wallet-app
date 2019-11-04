import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 16,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        address: {
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold'
        }
    });
