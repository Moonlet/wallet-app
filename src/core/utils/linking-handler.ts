import { Platform, Linking } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';

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

export const openPhoneSettings = () => {
    if (Platform.OS === 'ios') {
        Linking.canOpenURL('app-settings:')
            .then(supported => {
                if (supported) {
                    return Linking.openURL('app-settings:');
                }
            })
            .catch();
    } else {
        AndroidOpenSettings.appDetailsSettings();
    }
};
