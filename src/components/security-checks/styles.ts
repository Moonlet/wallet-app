import { StyleSheet, Dimensions } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingBottom: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.appBackground
        },
        content: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 3,
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
            color: theme.colors.text,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 6
        },
        title: {
            fontSize: normalize(25),
            lineHeight: normalize(30)
        },
        message: {
            fontSize: normalize(18),
            lineHeight: normalize(25),
            marginTop: BASE_DIMENSION * 6
        },
        imageContainerStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        imageStyle: {
            width: Dimensions.get('window').width * 0.5,
            height: Dimensions.get('window').width * 0.5,
            opacity: 0.7
        }
    });
