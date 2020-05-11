import { IAppConfig } from './config-interface';
import { firebaseConfig } from './firebase-web-beta';

export const CONFIG: IAppConfig = {
    supportUrl: 'https://moonlet.uvdesk.com/en/customer/create-ticket',
    env: process.env.MOONLET_SOME_KEY,
    tokensUrl: 'https://fire.moonlet.dev/static/tokens/',
    dataApiUrl: 'https://api.moonlet.dev/data',
    termsAndConditionsUrl:
        'https://fire.moonlet.dev/static/terms/terms-of-service.html?v=' + Date.now(),
    privacyPolicyUrl: 'https://fire.moonlet.dev/static/terms/privacy-policy.html?v=' + Date.now(),
    firebaseConfigFetchInterval: 0,
    ntpServer: 'pool.ntp.org',
    ntpPort: 123,
    extSyncUpdateStateUrl: 'https://fire.moonlet.dev/functions/extensionSync/updateState',
    extSyncDisconnectUrl: 'https://fire.moonlet.dev/functions/extensionSync/disconnect',
    extSyncSendRequestUrl: 'https://fire.moonlet.dev/functions/extensionSync/sendRequest',
    extSyncSendResponseUrl: 'https://fire.moonlet.dev/functions/extensionSync/sendResponse',
    firebaseWebConfig: firebaseConfig,
    keychain: 'com.moonlet.beta'
};

export default CONFIG;
