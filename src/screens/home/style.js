import { StyleSheet } from 'react-native';

const header = {
    height: 50,
    backgroundColor: '#999999',

    alignSelf: 'stretch'
};

export default StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: 40,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#121212',
        ...StyleSheet.absoluteFill
    },
    balancesContainer: {
        height: 160
    },
    header,
    text: {
        color: '#FFFFFF',
        fontFamily: 'System'
    }
});
