import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION,
            marginTop: BASE_DIMENSION * 3
        },
        tabContainer: {
            flexDirection: 'row',
            paddingHorizontal: BASE_DIMENSION // TODO: remove this if screen already has this
        },
        tabInactive: {
            flex: 1,
            paddingVertical: BASE_DIMENSION,
            borderRadius: BORDER_RADIUS * 2
        },
        tabActive: {
            backgroundColor: theme.colors.textTertiary
        },
        tabTextActive: {
            color: theme.colors.accent // this is for active
        },
        tabTextInactive: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            textAlign: 'center',
            color: theme.colors.textSecondary // this is for inactive
        }
    });
