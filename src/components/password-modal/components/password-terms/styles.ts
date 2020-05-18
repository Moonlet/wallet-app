import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    ICON_CONTAINER_SIZE
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingBottom: BASE_DIMENSION * 10,
            backgroundColor: theme.colors.appBackground
        },
        content: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 5,
            paddingTop: BASE_DIMENSION * 2
        },
        bottomButton: {
            width: '100%'
        },
        confirmTextContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        textStyle: {
            fontSize: normalizeFontAndLineHeight(19),
            lineHeight: normalizeFontAndLineHeight(25),
            color: theme.colors.text,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 6
        },
        imageStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        backIconContainer: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: BASE_DIMENSION
        },
        backIcon: {
            color: theme.colors.accent
        }
    });
