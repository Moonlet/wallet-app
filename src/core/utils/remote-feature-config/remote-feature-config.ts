import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../../config';
import { RemoteFeature } from './types';
import { captureException as SentryCaptureException } from '@sentry/react-native';

const featuresConfig = {};

export const getRemoteConfigFeatures = async () => {
    const config = remoteConfig();

    const duration = CONFIG.firebaseConfigFetchInterval;
    if (__DEV__) {
        await config.setConfigSettings({
            minimumFetchIntervalMillis: 0
        });
    }

    try {
        // Set default values
        const defaultValues = {};
        for (const feature of Object.values(RemoteFeature)) {
            defaultValues[feature] = [];
        }
        defaultValues[RemoteFeature.TC_VERSION] = 0;
        await config.setDefaults(defaultValues);

        await config.fetch(duration);

        const activated = await config.fetchAndActivate();

        if (activated) {
            // Ensures the last activated config are available to the getters.
            await config.ensureInitialized();

            const all = config.getAll();
            const allKeys = Object.keys(all);

            for (const key of allKeys) {
                const val = all[key].asString();
                try {
                    featuresConfig[key] = JSON.parse(val);
                } catch {
                    featuresConfig[key] = val;
                }
            }
        } else {
            // Set default values
            for (const feature of Object.values(RemoteFeature)) {
                featuresConfig[feature] = [];
            }
            featuresConfig[RemoteFeature.TC_VERSION] = 0;

            SentryCaptureException(new Error('Remote config not activated'));
        }
    } catch (error) {
        // Set default values
        for (const feature of Object.values(RemoteFeature)) {
            featuresConfig[feature] = [];
        }
        featuresConfig[RemoteFeature.TC_VERSION] = 0;

        SentryCaptureException(new Error(JSON.stringify(error)));
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
    // if (__DEV__) {
    //     return true;
    // }

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
