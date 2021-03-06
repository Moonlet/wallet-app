import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../styles/dimensions';

const CIRCLE_SIZE = normalize(40);
const LINE_HEIGTH = normalize(15);

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.appBackground,
            marginBottom: BASE_DIMENSION * 2
        },
        round: {
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            backgroundColor: theme.colors.cardBackground,
            marginRight: BASE_DIMENSION
        },
        linesWrapper: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        firstRow: {
            height: LINE_HEIGTH,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS
        },
        secondRow: {
            height: LINE_HEIGTH,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS
        }
    });
