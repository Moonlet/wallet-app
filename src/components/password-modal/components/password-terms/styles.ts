import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';
import { normalize } from '../../../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: normalize(BASE_DIMENSION * 5),
            paddingTop: normalize(BASE_DIMENSION * 20),
            paddingBottom: normalize(BASE_DIMENSION * 10),
            backgroundColor: theme.colors.appBackground
        },
        bottomButton: {
            width: '100%'
        },
        confirmTextContainer: {
            flexDirection: 'row',
            marginBottom: normalize(BASE_DIMENSION * 2)
        },
        textStyle: {
            lineHeight: normalize(21),
            color: theme.colors.text,
            opacity: 0.87,
            textAlign: 'center',
            paddingHorizontal: normalize(BASE_DIMENSION * 6)
        },
        imageStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });
