import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import CONFIG from '../../../config';
import { RemoteFeature } from './types';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { Blockchain } from '../../blockchain/types';

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

        await config.fetchAndActivate();

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

/**
 * solana:sol, solana:eth, zilliqa:port
 */
export const remoteFeatureSwapContainsToken = (
    blockchain: Blockchain,
    tokenSymbol: string
): boolean => {
    if (!blockchain || !tokenSymbol) return false;

    const feature = RemoteFeature.LIST_SWAP_TOKENS_V3;

    return (
        featuresConfig &&
        featuresConfig[feature] &&
        featuresConfig[feature]?.length > 0 &&
        !!featuresConfig[feature].find((el: any) => {
            try {
                const e = el.split(':');
                return (
                    e[0].toLowerCase() === blockchain.toLowerCase() &&
                    e[1].toLowerCase() === tokenSymbol.toLowerCase()
                );
            } catch {
                SentryCaptureException(
                    new Error(
                        `Failed to parse remote feature swap contains token ${blockchain}:${tokenSymbol}, ${el}`
                    )
                );
                return false;
            }
        })
    );
};

export const isFeatureActive = (feature: RemoteFeature): boolean => {
    if (__DEV__) {
        return true;
    }

    if (feature === RemoteFeature.IMPROVED_NONCE) {
        // TODO: cleanup project of improved nonce
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

export const getDevToolRewardsAddress = () => {
    return featuresConfig && featuresConfig[RemoteFeature.DEV_SOL_REWARDS];
};
