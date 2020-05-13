import { Platform, Linking } from 'react-native';

export const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
};

export const openURL = (url: string) => {
    if (Platform.OS === 'web') {
        window.open(url);
    } else {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    }
};
