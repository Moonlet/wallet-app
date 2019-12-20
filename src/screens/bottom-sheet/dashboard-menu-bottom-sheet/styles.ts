import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#2c2c2fAA'
        },
        content: {
            backgroundColor: theme.colors.cardBackgroundSecondary,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingVertical: BASE_DIMENSION * 2
        },
        header: {
            flex: 1,
            backgroundColor: theme.colors.cardBackgroundSecondary,
            paddingVertical: BASE_DIMENSION * 2,
            borderTopLeftRadius: BORDER_RADIUS * 3,
            borderTopRightRadius: BORDER_RADIUS * 3,
            alignItems: 'center'
        },
        panelHandle: {
            width: 40,
            height: 8,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.accent
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
            color: theme.colors.text
        },
        description: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary
        }
    });
