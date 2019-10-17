import { StyleSheet } from 'react-native';
import COLORS from '../../styles/colors';

export default StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        color: '#FFF'
        //width: 200
    },
    darkerText: {
        color: COLORS.lightGray
    },
    mainText: {
        fontSize: 34
    }
});
