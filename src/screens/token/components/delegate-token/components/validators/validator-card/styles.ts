import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../../../../core/theme/itheme';
import {
    BORDER_RADIUS,
    BASE_DIMENSION,
    normalize,
    ICON_CONTAINER_SIZE
} from '../../../../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        cardContainer: {
            backgroundColor: theme.colors.cardBackground,
            flexDirection: 'column',
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION * 2,
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 3,
            marginBottom: BASE_DIMENSION
        },
        topContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        topRow: {
            flex: 1,
            flexDirection: 'column',
            marginRight: BASE_DIMENSION * 4
        },
        topRowFirstLine: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: BASE_DIMENSION / 2
        },
        topRowSecondLine: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        primaryTextContainer: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        primaryText: {
            fontSize: normalize(16),
            fontWeight: '500',
            color: theme.colors.text
        },
        secondaryText: {
            fontSize: normalize(11),
            lineHeight: normalize(13),
            color: theme.colors.textSecondary
        },
        tertiaryText: {
            fontSize: normalize(10),
            color: theme.colors.textTertiary
        },
        imageStyle: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            marginRight: BASE_DIMENSION + BASE_DIMENSION / 2,
            marginTop: BASE_DIMENSION / 2,
            borderRadius: ICON_CONTAINER_SIZE
        },
        amountText: {
            fontSize: normalize(11),
            color: theme.colors.text
        },
        chevronRight: {
            alignSelf: 'flex-end',
            color: theme.colors.accent
        },
        bottomContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        bottomPrimaryText: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: 'center'
        },
        bottomSecondaryText: {
            fontSize: normalize(11),
            lineHeight: normalize(13),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        }
    });
