import { IAppConfig } from './config-interface';
import { firebaseConfig } from './firebase-web-release';

const extSyncBaseUrl = 'https://fire.moonlet.io/functions/extensionSync';

export const CONFIG_RELEASE: IAppConfig = {
    walletApiBaseUrl: 'https://api.moonlet.app',
    supportUrl: 'https://moonlet.uvdesk.com/en/customer/create-ticket',
    env: process.env.MOONLET_SOME_KEY,
    tokensUrl: 'https://fire.moonlet.io/static/tokens/',
    termsAndConditionsUrl:
        'https://fire.moonlet.io/static/terms/terms-of-service.html?v=' + Date.now(),
    privacyPolicyUrl: 'https://fire.moonlet.io/static/terms/privacy-policy.html?v=' + Date.now(),
    troubleshootingUrl: 'https://fire.moonlet.io/static/ledger/troubleshooting.html',
    firebaseConfigFetchInterval: 15 * 60, // 15 mins
    ntpServer: 'pool.ntp.org',
    ntpPort: 123,
    extSync: {
        bucket: 'gs://moonlet-extension-sync-live',
        updateStateUrl: extSyncBaseUrl + '/updateState',
        disconnectUrl: extSyncBaseUrl + '/disconnect',
        sendRequestUrl: extSyncBaseUrl + '/sendRequest',
        sendResponseUrl: extSyncBaseUrl + '/sendResponse',
        deleteRequestUrl: extSyncBaseUrl + '/deleteRequest'
    },
    firebaseWebConfig: firebaseConfig
};
