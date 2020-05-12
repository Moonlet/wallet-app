import { CONFIG_BETA } from './config-beta';
import { CONFIG_RELEASE } from './config-release';
import DeviceInfo from 'react-native-device-info';

let CONF = CONFIG_RELEASE;
if (DeviceInfo.getBundleId() === 'com.moonlet.beta') {
    CONF = CONFIG_BETA;
}

export const CONFIG = CONF;
export default CONFIG;
