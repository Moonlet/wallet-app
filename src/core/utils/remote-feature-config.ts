import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../config';

export enum RemoteFeature {
    NEAR = 'feature_near',
    COSMOS = 'feature_cosmos',
    CELO = 'feature_celo',
    DEV_TOOLS = 'dev_tools',
    TC_VERSION = 'tcVersion',
    NOTIF_CENTER = 'feature_notification_center'
}

let featuresConfig = {};

export const getRemoteConfigFeatures = async () => {
    const duration = CONFIG.firebaseConfigFetchInterval;
    if (__DEV__) {
        firebase.config().enableDeveloperMode();
    }

    try {
        await firebase.config().fetch(duration);
        await firebase.config().activateFetched();

        const objects = await firebase
            .config()
            .getValues([
                RemoteFeature.NEAR,
                RemoteFeature.COSMOS,
                RemoteFeature.CELO,
                RemoteFeature.DEV_TOOLS,
                RemoteFeature.TC_VERSION,
                RemoteFeature.NOTIF_CENTER
            ]);

        // Retrieve values
        Object.keys(objects).forEach(key => {
            featuresConfig[key] = objects[key].val();
        });
    } catch (err) {
        // Set default values
        featuresConfig = {
            [RemoteFeature.NEAR]: JSON.stringify([]),
            [RemoteFeature.DEV_TOOLS]: JSON.stringify([]),
            [RemoteFeature.COSMOS]: JSON.stringify([]),
            [RemoteFeature.CELO]: JSON.stringify([]),
            [RemoteFeature.TC_VERSION]: '0',
            [RemoteFeature.NOTIF_CENTER]: JSON.stringify([])
        };
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

export const isFeatureActive = (feature: RemoteFeature): boolean => {
    if (__DEV__) {
        return true;
    }
    if (
        (feature === RemoteFeature.NEAR ||
            feature === RemoteFeature.COSMOS ||
            feature === RemoteFeature.CELO ||
            feature === RemoteFeature.DEV_TOOLS ||
            feature === RemoteFeature.NOTIF_CENTER) &&
        featuresConfig
    ) {
        const values = featuresConfig[feature] || [];
        if (values.length > 0) {
            return values.indexOf(DeviceInfo.getUniqueId()) >= 0;
        }
    }
    return false;
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
