import { NativeModules } from 'react-native';

export const forbidFunction = async () => {
    try {
        await NativeModules.PreventScreenshotModule.forbid();
    } catch (e) {
        //
    }
};

export const allowFunction = async () => {
    try {
        await NativeModules.PreventScreenshotModule.allow();
    } catch (e) {
        //
    }
};
