import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    ICON_CONTAINER_SIZE,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        contentContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginTop: BASE_DIMENSION * 5
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: BASE_DIMENSION
        },
        address: {
            color: theme.colors.textSecondary
        },
        name: {
            color: theme.colors.text,
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(23)
        },
        selectedText: {
            color: theme.colors.accent
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.4)'
        },
        iconContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
