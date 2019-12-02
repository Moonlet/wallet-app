import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { pw, ph } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: 40,
            justifyContent: 'center',
            backgroundColor: theme.colors.appBackground
        },
        logoImage: {
            height: ph(20),
            width: pw(40),
            alignSelf: 'center',
            resizeMode: 'contain'
        },
        launchingSoonText: {
            fontWeight: 'bold',
            fontSize: 22,
            lineHeight: 28,
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.text,
            opacity: 0.87,
            marginBottom: BASE_DIMENSION
        },
        newSectionText: {
            fontSize: 17,
            lineHeight: 22,
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 7
        },
        skeletonRow: {
            marginBottom: BASE_DIMENSION * 2
        }
    });
