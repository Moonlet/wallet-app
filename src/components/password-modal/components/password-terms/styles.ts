import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 5,
            paddingTop: BASE_DIMENSION * 20,
            paddingBottom: BASE_DIMENSION * 10,
            backgroundColor: theme.colors.appBackground
        },
        bottomButton: {
            width: '100%'
        },
        confirmTextContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        textStyle: {
            fontSize: normalize(19),
            lineHeight: normalize(25),
            color: theme.colors.text,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 6
        },
        imageStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });
