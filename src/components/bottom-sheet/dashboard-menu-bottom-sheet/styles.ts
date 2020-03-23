import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../styles/dimensions';
import { normalize } from '../../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        content: {
            backgroundColor: theme.colors.bottomSheetBackground,
            paddingHorizontal: normalize(BASE_DIMENSION * 3),
            paddingVertical: normalize(BASE_DIMENSION * 2)
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: normalize(BASE_DIMENSION),
            marginBottom: normalize(BASE_DIMENSION * 2)
        },
        iconContainer: {
            backgroundColor: theme.colors.appBackground,
            padding: normalize(BASE_DIMENSION),
            marginRight: normalize(BASE_DIMENSION * 2),
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
            lineHeight: normalize(21),
            color: theme.colors.text
        },
        description: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.textSecondary
        },
        arrowRight: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
