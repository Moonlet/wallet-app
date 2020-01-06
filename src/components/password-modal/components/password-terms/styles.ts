import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

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
            fontSize: 17,
            lineHeight: 21,
            color: theme.colors.text,
            opacity: 0.87,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 6
        },
        imageStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });
