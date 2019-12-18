import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        backgroundContainer: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            height: '100%'
        },
        container: {
            marginTop: 250,
            marginBottom: 200,
            height: 150,
            backgroundColor: theme.colors.modalBackground,
            borderRadius: BORDER_RADIUS * 2,
            marginLeft: BASE_DIMENSION * 3,
            marginRight: BASE_DIMENSION * 3
        },
        textIndicator: {
            fontSize: theme.fontSize.regular,
            textAlign: 'center',
            color: theme.colors.text,
            marginTop: 50,
            marginBottom: 10
        }
    });
