import { Alert } from 'react-native';

export const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise(resolve => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Cancel',
                    onPress: () => resolve(false),
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => resolve(true) }
            ],
            { cancelable: false }
        );
    });
};
