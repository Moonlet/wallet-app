import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { ph, pw } from '../../../../styles';
import {
    BASE_DIMENSION,
    LETTER_SPACING,
    normalizeFontAndLineHeight,
    SCREEN_HEIGHT
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web,
        },
        content: {
            flex: 1
        },
        listContainer: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION * 2
        },
        validatorsList: {
            paddingTop: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION * 11
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        emptySection: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        logoImage: {
            height: ph(20),
            width: pw(50),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 2
        },
        noNodesText: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 2
        }
    });
