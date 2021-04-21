import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../../config';
import { RemoteFeature } from './types';

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
                RemoteFeature.BETA_BADGE,
                RemoteFeature.NEAR_LEDGER_BLE,
                RemoteFeature.COSMOS,
                RemoteFeature.CELO,
                RemoteFeature.DEV_TOOLS,
                RemoteFeature.TC_VERSION,
                RemoteFeature.SOLANA,
                RemoteFeature.IMPROVED_NONCE,
                RemoteFeature.ZIL_STAKING_SMART_SCREEN,
                RemoteFeature.LIST_SWAP_TOKENS
            ]);

        // Retrieve values
        Object.keys(objects).forEach(key => {
            featuresConfig[key] = objects[key].val();
        });
    } catch (err) {
        // Set default values
        featuresConfig = {
            [RemoteFeature.BETA_BADGE]: JSON.stringify([]),
            [RemoteFeature.NEAR_LEDGER_BLE]: JSON.stringify([]),
            [RemoteFeature.DEV_TOOLS]: JSON.stringify([]),
            [RemoteFeature.COSMOS]: JSON.stringify([]),
            [RemoteFeature.CELO]: JSON.stringify([]),
            [RemoteFeature.SOLANA]: JSON.stringify([]),
            [RemoteFeature.ZIL_STAKING_SMART_SCREEN]: JSON.stringify([]),
            [RemoteFeature.IMPROVED_NONCE]: JSON.stringify([]),
            [RemoteFeature.TC_VERSION]: '0'
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

export const remoteFeatureContainsToken = (symbol: string): boolean => {
    if (!symbol) return false;

    const feature = RemoteFeature.LIST_SWAP_TOKENS;

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
