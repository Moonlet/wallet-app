import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

export enum RemoteFeature {
    NEAR = 'feature_near',
    DEV_TOOLS = 'dev_tools'
}

let featuresConfig;

export const getRemoteConfigFeatures = async () => {
    // TODO: decide if 1 hour should be the optimal fetch duration
    // set fetch cache duration to 1 hour for live environment
    let duration = 900;
    if (__DEV__) {
        firebase.config().enableDeveloperMode();
        duration = 0;
    }

    await firebase.config().fetch(duration);
    await firebase.config().activateFetched();
    const objects = await firebase
        .config()
        .getValues([RemoteFeature.NEAR, RemoteFeature.DEV_TOOLS]);

    featuresConfig = {};
    // Retrieve values
    Object.keys(objects).forEach(key => {
        featuresConfig[key] = objects[key].val();
    });

    return featuresConfig;
};

export const isFeatureActive = (feature: RemoteFeature): boolean => {
    // if (__DEV__) {
    //     return true;
    // }
    if (feature === RemoteFeature.NEAR || feature === RemoteFeature.DEV_TOOLS) {
        const values = JSON.parse(featuresConfig[feature]);
        const uniqueId = values.filter(id => id === DeviceInfo.getUniqueId());
        if (uniqueId.length) {
            return true;
        }
    }
    return false;
};
