import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../../config';
import { RemoteFeature } from './types';

const featuresConfig = {};

export const getRemoteConfigFeatures = async () => {
    const duration = CONFIG.firebaseConfigFetchInterval;
    if (__DEV__) {
        firebase.config().enableDeveloperMode();
    }

    try {
        await firebase.config().fetch(duration);
        await firebase.config().activateFetched();

        const objects = await firebase.config().getValues(Object.values(RemoteFeature));

        // Retrieve values
        Object.keys(objects).forEach(key => {
            featuresConfig[key] = objects[key].val();
        });
    } catch (err) {
        // Set default values
        for (const feature of Object.values(RemoteFeature)) {
            featuresConfig[feature] = JSON.stringify([]);
        }
        featuresConfig[RemoteFeature.TC_VERSION] = '0';
    }

    for (const key of Object.keys(featuresConfig)) {
        try {
            featuresConfig[key] = JSON.parse(featuresConfig[key]);
        } catch {
            // console.error(`${key} from remote feature config is not a valid JSON string`);
        }
    }

    return featuresConfig;
};

export const remoteFeatureSwapContainsToken = (symbol: string): boolean => {
    if (!symbol) return false;

    const feature = RemoteFeature.LIST_SWAP_TOKENS_V2;

    return (
        featuresConfig &&
        featuresConfig[feature] &&
        featuresConfig[feature]?.length > 0 &&
        !!featuresConfig[feature].find((el: any) => el.toLowerCase() === symbol.toLowerCase())
    );
};

export const isFeatureActive = (feature: RemoteFeature): boolean => {
    if (__DEV__) {
        return true;
    }

    if (feature !== RemoteFeature.TC_VERSION)
        return (
            featuresConfig[feature]?.length > 0 &&
            !!featuresConfig[feature].find(
                element => element === '*' || element === DeviceInfo.getUniqueId()
            )
        );
};

export const getFirebaseTCVersion = async (): Promise<number> => {
    if (featuresConfig) {
        const tcVersion = featuresConfig[RemoteFeature.TC_VERSION];

        if (tcVersion) {
            await AsyncStorage.setItem('tcAcceptedVersion', String(tcVersion));
        }

        return tcVersion;
    }

    return;
};
