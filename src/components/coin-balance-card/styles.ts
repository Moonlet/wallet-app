import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            padding: 0,
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: 'center'
        },
        darkerText: {
            color: theme.colors.textDarker
        },
        mainText: {
            fontSize: 34
        }
    });
