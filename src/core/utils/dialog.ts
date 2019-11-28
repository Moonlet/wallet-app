import { Alert } from 'react-native';

export const confirm = (title: string, message: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Cancel',
                    onPress: () => reject(),
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => resolve() }
            ],
            { cancelable: false }
        );
    });
};
