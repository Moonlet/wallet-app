import { IAppConfig } from './config-interface';
import { firebaseConfig } from './firebase-web-release';

export const CONFIG: IAppConfig = {
    supportUrl: 'https://moonlet.uvdesk.com/en/customer/create-ticket',
    env: process.env.MOONLET_SOME_KEY,
    tokensUrl: 'https://fire.moonlet.io/static/tokens/',
    dataApiUrl: 'https://api.moonlet.io/data',
    termsAndConditionsUrl:
        'https://fire.moonlet.io/static/terms/terms-of-service.html?v=' + Date.now(),
    privacyPolicyUrl: 'https://fire.moonlet.io/static/terms/privacy-policy.html?v=' + Date.now(),
    firebaseConfigFetchInterval: 15 * 60, // 15 mins
    ntpServer: 'pool.ntp.org',
    ntpPort: 123,
    extSyncUpdateStateUrl: 'https://fire.moonlet.io/functions/extensionSync/updateState',
    extSyncDisconnectUrl: 'https://fire.moonlet.io/functions/extensionSync/disconnect',
    extSyncSendRequestUrl: 'https://fire.moonlet.io/functions/extensionSync/sendRequest',
    extSyncSendResponseUrl: 'https://fire.moonlet.io/functions/extensionSync/sendResponse',
    firebaseWebConfig: firebaseConfig,
    keychain: 'com.moonlet'
};

export default CONFIG;
