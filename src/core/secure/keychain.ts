import * as Keychain from 'react-native-keychain';
import { hash } from './encrypt';
import AsyncStorage from '@react-native-community/async-storage';

const defaultOptions = {
    service: 'com.moonlet'
};

const USERNAME = 'moonlet-app';

export const setPassword = async (password: string, shouldEncrypt: boolean = true) => {
    await Keychain.resetGenericPassword(defaultOptions);

    if (shouldEncrypt) {
        password = await hash(password);
    }

    await Keychain.setGenericPassword(USERNAME, password, defaultOptions);
};

export const getPassword = async () => {
    const appInstall = await AsyncStorage.getItem('alreadyLaunched');

    if (appInstall == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
    } else {
        await Keychain.resetGenericPassword(defaultOptions);
    }

    return Keychain.getGenericPassword(defaultOptions);
};
