import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight,
    SCREEN_HEIGHT
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        wrapper: {
            flex: 1,
            position: 'absolute',
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.gradientDark + 'BF', // 75% opacity
            justifyContent: 'center'
        },
        container: {
            maxHeight: (SCREEN_HEIGHT * 3) / 4,
            marginHorizontal: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            padding: BASE_DIMENSION * 2
        },
        scrollView: {
            flexGrow: 1,
            paddingVertical: BASE_DIMENSION * 2
        },
        message: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text
        }
    });
