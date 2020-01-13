import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, SCREEN_HEIGHT } from '../../styles/dimensions';
import { ph, pw } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            justifyContent: 'center',
            height: SCREEN_HEIGHT
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
            marginBottom: BASE_DIMENSION * 2
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: BASE_DIMENSION * 2
        },
        button: {
            marginHorizontal: BASE_DIMENSION * 2
        }
    });
