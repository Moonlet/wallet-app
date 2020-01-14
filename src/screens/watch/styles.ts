import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { pw, ph } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 3,
            justifyContent: 'center',
            backgroundColor: theme.colors.appBackground
        },
        logoImage: {
            height: ph(20),
            width: pw(40),
            alignSelf: 'center',
            resizeMode: 'contain'
        },
        textSection: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        launchingSoonText: {
            fontWeight: 'bold',
            fontSize: 22,
            lineHeight: 28,
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2
        },
        newSectionText: {
            fontSize: 17,
            alignContent: 'center',
            lineHeight: 22,
            textAlign: 'center',
            marginHorizontal: BASE_DIMENSION * 5,
            color: theme.colors.textSecondary
        },
        skeletonRow: {
            marginVertical: BASE_DIMENSION
        }
    });
