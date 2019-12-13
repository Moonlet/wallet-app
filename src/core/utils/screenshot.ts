import { NativeModules } from 'react-native';

export const forbidScreenshots = async () => {
    try {
        await NativeModules.PreventScreenshotModule.forbid();
    } catch (e) {
        //
    }
};

export const allowScreenshots = async () => {
    try {
        await NativeModules.PreventScreenshotModule.allow();
    } catch (e) {
        //
    }
};
