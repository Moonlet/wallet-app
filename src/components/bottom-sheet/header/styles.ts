import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../styles/dimensions';
import { normalize } from '../../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        header: {
            flex: 1,
            backgroundColor: theme.colors.bottomSheetBackground,
            paddingTop: normalize(BASE_DIMENSION * 2),
            paddingBottom: BASE_DIMENSION,
            borderTopLeftRadius: BORDER_RADIUS * 2,
            borderTopRightRadius: BORDER_RADIUS * 2
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.textTertiary
        }
    });
