import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { SCREEN_HEIGHT } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        }
    });
