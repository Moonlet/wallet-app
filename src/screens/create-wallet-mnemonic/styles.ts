import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            padding: 0,
            paddingTop: 40,
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },

        bottomButton: {
            marginHorizontal: 6,
            marginTop: 20
        }
    });
