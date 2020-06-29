import { IAppConfig } from './config-interface';
import { firebaseConfig } from './firebase-web-release';

const extSyncBaseUrl = 'https://fire.moonlet.io/functions/extensionSync';
const walletApiBaseUrl = 'http://127.0.0.1:8080/wallet-ui'; // TODO: update this

export const CONFIG_RELEASE: IAppConfig = {
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
    extSync: {
        bucket: 'gs://moonlet-extension-sync-live',
        updateStateUrl: extSyncBaseUrl + '/updateState',
        disconnectUrl: extSyncBaseUrl + '/disconnect',
        sendRequestUrl: extSyncBaseUrl + '/sendRequest',
        sendResponseUrl: extSyncBaseUrl + '/sendResponse',
        deleteRequestUrl: extSyncBaseUrl + '/deleteRequest'
    },
    firebaseWebConfig: firebaseConfig,
    notificationCenter: {
        getNotificationsUrl: walletApiBaseUrl + '/notifications',
        markSeenUrl: walletApiBaseUrl + '/notifications-markseen',
        getRegisteredAddresses: walletApiBaseUrl + '/get-registered-addresses',
        sendPushNotifications: walletApiBaseUrl + '/send-push-notifications',
        addPushNotifTokens: walletApiBaseUrl + '/push-notifications-tokens/add',
        hasUnseenNotifs: walletApiBaseUrl + '/has-unseen-notifications'
    }
};
