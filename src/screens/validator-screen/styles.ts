import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { SCREEN_HEIGHT, BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT,
            paddingVertical: BASE_DIMENSION * 5,
            paddingHorizontal: BASE_DIMENSION * 3
        },
        topContainer: {
            flexDirection: 'column'
        },
        topText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        },
        title: {
            fontSize: normalize(30),
            lineHeight: normalize(41),
            color: '#FFFFFF',
            letterSpacing: 0.4,
            textAlign: 'center',
            marginVertical: BASE_DIMENSION
        },
        token: {
            fontSize: normalize(16),
            lineHeight: normalize(21),
            color: '#FFFFFF'
        },
        subTitle: {
            fontSize: normalize(16),
            lineHeight: normalize(21),
            color: theme.colors.text,
            textAlign: 'center'
        },
        bottomContainer: {
            marginHorizontal: BASE_DIMENSION
        },

        // navigation
        navigationImage: {
            height: normalize(36),
            width: normalize(36),
            borderRadius: normalize(36),
            marginRight: BASE_DIMENSION * 2,
            alignSelf: 'center'
        },
        labelName: {
            fontSize: normalize(22),
            lineHeight: normalize(28),
            fontWeight: 'bold',
            letterSpacing: 0.35,
            color: '#FFFFFF',
            textAlign: 'center'
        },
        website: {
            fontSize: normalize(11),
            lineHeight: normalize(13),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        }
    });
