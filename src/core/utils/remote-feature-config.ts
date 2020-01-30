import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

export enum RemoteFeature {
    NEAR = 'feature_near'
}

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
    const objects = await firebase.config().getValues([RemoteFeature.NEAR]);

    const data = {};
    // Retrieve values
    Object.keys(objects).forEach(key => {
        data[key] = objects[key].val();
    });

    return data;
};

export const isFeatureActive = async (feature: RemoteFeature): Promise<boolean> => {
    const config = await getRemoteConfigFeatures();

    if (feature === RemoteFeature.NEAR) {
        const values = JSON.parse(config[feature]);
        const uniqueId = values.filter(id => id === DeviceInfo.getUniqueId());
        if (uniqueId.length) {
            return true;
        }
    }
    return false;
};
