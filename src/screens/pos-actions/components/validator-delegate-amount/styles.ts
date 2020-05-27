import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER_SIZE, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            padding: BASE_DIMENSION + BASE_DIMENSION / 2,
            paddingHorizontal: BASE_DIMENSION * 3
        },
        icon: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            borderRadius: ICON_CONTAINER_SIZE,
            alignSelf: 'center',
            marginRight: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        labelContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginBottom: BASE_DIMENSION / 2
        },
        labelName: {
            fontSize: normalize(16),
            fontWeight: '500',
            letterSpacing: 0.39,
            color: theme.colors.text,
            textAlign: 'center',
            marginRight: BASE_DIMENSION / 2
        },
        website: {
            fontSize: normalize(11),
            color: theme.colors.textSecondary
        },
        rankText: {
            fontSize: normalize(10),
            color: theme.colors.textTertiary
        },
        amount: {
            fontSize: normalize(14),
            lineHeight: normalize(19),
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.textSecondary,
            alignSelf: 'center'
        }
    });
