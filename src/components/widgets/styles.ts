import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        itemContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS
        },
        generalFlex: {
            flex: 1,
            marginBottom: BASE_DIMENSION + 2
        },
        modulesContainer: {
            flex: 1,
            marginTop: BASE_DIMENSION,
            marginHorizontal: BASE_DIMENSION
        },
        separatorContainer: {
            height: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground
        },
        itemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: BASE_DIMENSION + 2,
            marginTop: BASE_DIMENSION + 2,
            marginHorizontal: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2
        },
        headerText: {
            fontSize: normalizeFontAndLineHeight(18),
            fontWeight: '400',
            lineHeight: normalizeFontAndLineHeight(22),
            letterSpacing: -0.4,
            color: theme.colors.text
        },
        expandingArrow: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
