import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: Platform.OS === 'ios' ? 6 : 0,
            height: 80,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            flexDirection: 'row',
            padding: 12
        },
        accountInfoContainer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            marginHorizontal: BASE_DIMENSION
        },
        icon: {
            color: theme.colors.accent
        }
    });
