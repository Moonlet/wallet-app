import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: BASE_DIMENSION * 3,
            borderWidth: 1,
            borderColor: theme.colors.accent,
            flexDirection: 'row'
        },
        tabButton: {
            flexBasis: 0,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: BASE_DIMENSION
        },
        tabButtonText: {
            fontSize: 13,
            lineHeight: 18
        },
        tabButtonSelected: {
            backgroundColor: theme.colors.accent
        },
        tabButtonTextSelected: {
            color: theme.colors.appBackground
        }
    });
