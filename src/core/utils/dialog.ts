import { Alert } from 'react-native';
import { translate } from '../i18n';

export const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise(resolve => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: translate('App.labels.cancel'),
                    onPress: () => resolve(false),
                    style: 'cancel'
                },
                { text: translate('App.labels.ok'), onPress: () => resolve(true) }
            ],
            { cancelable: false }
        );
    });
};
