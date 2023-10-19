import { IAppConfig } from './config-interface';
import { firebaseConfig } from './firebase-web-release';

const extSyncBaseUrl = 'https://fire.moonlet.io/functions/extensionSync';

export const CONFIG_BETA: IAppConfig = {
    walletApiBaseUrl: 'https://api.moonlet.app',
    supportUrl: 'https://fire.moonlet.io/static/support/webview.html',
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

// import { IAppConfig } from './config-interface';
// import { firebaseConfig } from './firebase-web-beta';

// const extSyncBaseUrl = 'https://fire.moonlet.dev/functions/extensionSync';

// export const CONFIG_BETA: IAppConfig = {
//     walletApiBaseUrl: 'https://api.moonlet.dev',
//     // walletApiBaseUrl: 'http://127.0.0.1:8080',

//     supportUrl: 'https://fire.moonlet.dev/static/support/webview.html',
//     env: process.env.MOONLET_SOME_KEY,
//     tokensUrl: 'https://fire.moonlet.dev/static/tokens/',
//     termsAndConditionsUrl:
//         'https://fire.moonlet.dev/static/terms/terms-of-service.html?v=' + Date.now(),
//     privacyPolicyUrl: 'https://fire.moonlet.dev/static/terms/privacy-policy.html?v=' + Date.now(),
//     troubleshootingUrl: 'https://fire.moonlet.dev/static/ledger/troubleshooting.html',
//     firebaseConfigFetchInterval: 0,
//     ntpServer: 'pool.ntp.org',
//     ntpPort: 123,
//     extSync: {
//         bucket: 'gs://moonlet-extension-sync',
//         updateStateUrl: extSyncBaseUrl + '/updateState',
//         disconnectUrl: extSyncBaseUrl + '/disconnect',
//         sendRequestUrl: extSyncBaseUrl + '/sendRequest',
//         sendResponseUrl: extSyncBaseUrl + '/sendResponse',
//         deleteRequestUrl: extSyncBaseUrl + '/deleteRequest'
//     },
//     firebaseWebConfig: firebaseConfig
// };
