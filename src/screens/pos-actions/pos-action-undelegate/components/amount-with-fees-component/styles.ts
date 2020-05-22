import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../../core/theme/itheme';
import { normalizeFontAndLineHeight, BASE_DIMENSION } from '../../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column'
        },
        defaultText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.text
        },
        sendText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            marginRight: BASE_DIMENSION / 2
        },
        toText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.text,
            marginRight: BASE_DIMENSION / 2
        }
    });
