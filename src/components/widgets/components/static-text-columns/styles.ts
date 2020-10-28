import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { normalizeFontAndLineHeight, BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: BASE_DIMENSION
        },
        itemContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
        text: {
            lineHeight: normalizeFontAndLineHeight(21),
            textAlign: 'center',
            fontSize: normalizeFontAndLineHeight(16),
            fontWeight: '400'
        },
        textColor: {
            color: theme.colors.textSecondary
        },
        headerValueText: {
            marginBottom: BASE_DIMENSION * 2
        },
        secondaryValueText: {
            marginBottom: BASE_DIMENSION / 2
        }
    });
