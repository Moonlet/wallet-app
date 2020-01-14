import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../styles/dimensions';

// color: theme.colors.textSecondary,
export default (theme: ITheme) =>
    StyleSheet.create({
        content: {
            backgroundColor: theme.colors.bottomSheetBackground,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingVertical: BASE_DIMENSION * 2
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2
        },
        iconContainer: {
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION,
            marginRight: BASE_DIMENSION * 2,
            borderRadius: BORDER_RADIUS
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        textContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        title: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.textSecondary
        },
        info: {
            fontSize: 16,
            lineHeight: 21,
            textAlign: 'center',
            color: theme.colors.textSecondary
        },
        description: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary
        },
        loadingContainer: {
            paddingTop: 24
        }
    });
