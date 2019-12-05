import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            height: '100%'
        },
        modalContainer: {
            marginTop: 200,
            marginBottom: 200,
            backgroundColor: theme.colors.modalBackground,
            borderRadius: BORDER_RADIUS * 2,
            marginLeft: BASE_DIMENSION * 3,
            marginRight: BASE_DIMENSION * 3
        },
        deviceRow: {
            height: 44
        },
        list: {
            flex: 1
        },
        text: {
            fontSize: theme.fontSize.regular
        },
        header: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        headerTitle: {
            margin: 10,
            fontSize: theme.fontSize.large,
            lineHeight: 20
        },

        errorTitle: {
            color: theme.colors.error,
            fontSize: theme.fontSize.regular,
            marginBottom: BASE_DIMENSION * 2
        },
        close: {
            margin: 10
        },
        indicator: {
            margin: 10
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
