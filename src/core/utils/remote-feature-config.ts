import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';

export enum RemoteFeature {
    NEAR = 'feature_near',
    COSMOS = 'feature_cosmos',
    DEV_TOOLS = 'dev_tools',
    TC_VERSION = 'tcVersion'
}

const featuresConfig = {};

export const getRemoteConfigFeatures = async () => {
    const duration = CONFIG.firebaseFetchDuration;
    if (__DEV__) {
        firebase.config().enableDeveloperMode();
    }

    // Set default values
    firebase.config().setDefaults({
        [RemoteFeature.NEAR]: false,
        [RemoteFeature.DEV_TOOLS]: false,
        [RemoteFeature.COSMOS]: false,
        [RemoteFeature.TC_VERSION]: undefined
    });

    await firebase.config().fetch(duration);
    await firebase.config().activateFetched();
    const objects = await firebase
        .config()
        .getValues([
            RemoteFeature.NEAR,
            RemoteFeature.COSMOS,
            RemoteFeature.DEV_TOOLS,
            RemoteFeature.TC_VERSION
        ]);

    // Retrieve values
    Object.keys(objects).forEach(key => {
        featuresConfig[key] = objects[key].val();
    });

    return featuresConfig;
};

export const isFeatureActive = (feature: RemoteFeature): boolean => {
    if (__DEV__) {
        return true;
    }
    if (
        (feature === RemoteFeature.NEAR ||
            feature === RemoteFeature.COSMOS ||
            feature === RemoteFeature.DEV_TOOLS) &&
        featuresConfig
    ) {
        const values = JSON.parse(featuresConfig[feature]);
        if (values.length > 0) {
            const uniqueId = values.filter(id => id === DeviceInfo.getUniqueId());
            if (uniqueId.length) {
                return true;
            }
        }
    }
    return false;
};

export const getFirebaseTCVersion = async (): Promise<number> => {
    if (featuresConfig) {
        const tcVersion = JSON.parse(featuresConfig[RemoteFeature.TC_VERSION]);

        if (tcVersion) {
            await AsyncStorage.setItem('tcAcceptedVersion', String(tcVersion));
        }

        return tcVersion;
    }

    return;
};
