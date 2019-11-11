import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center'
        },
        modalContainer: {
            backgroundColor: theme.colors.modalBackground,
            height: 380,
            borderRadius: BORDER_RADIUS * 2,
            marginLeft: BASE_DIMENSION * 3,
            marginRight: BASE_DIMENSION * 3
        },
        contentContainer: {
            marginTop: BASE_DIMENSION * 5
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION
        },
        leftIcon: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 1,
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2
        },
        rightIcon: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            paddingRight: BASE_DIMENSION
        },
        header: {
            flexDirection: 'row',
            paddingTop: BASE_DIMENSION * 3
        },
        headerButton: {
            color: theme.colors.accent
        },
        title: {
            fontSize: theme.fontSize.regular,
            textAlign: 'center',
            fontWeight: 'bold',
            width: 200
        },
        icon: {
            color: theme.colors.accent,
            padding: 4
        },
        textRow: {
            fontSize: theme.fontSize.regular,
            alignItems: 'flex-start',
            textAlign: 'left',
            lineHeight: 30
        }
    });
