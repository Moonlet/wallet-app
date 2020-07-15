import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, MARGIN_DIMENSION } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.topStatsCard,
            marginRight: MARGIN_DIMENSION,
            marginLeft: MARGIN_DIMENSION,
            marginTop: BASE_DIMENSION * 1.5,
            height: BASE_DIMENSION * 2.5,
            flexDirection: 'row',
            borderRadius: BASE_DIMENSION * 0.2
        },
        column: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.textSecondary
        },
        value: {
            fontSize: 22,
            fontWeight: 'bold',
            lineHeight: 28,
            color: theme.colors.text
        },
        reward: {
            color: theme.colors.positive
        }
    });
