import { IAppConfig } from './config-interface';

export const CONFIG: IAppConfig = {
    supportUrl: 'https://moonlet.xyz/links/support',
    env: process.env.MOONLET_SOME_KEY,
    tokensUrl: 'https://fire.moonlet.dev/static/tokens/',
    dataApiUrl: 'https://api.moonlet.dev/data',
    termsAndConditionsUrl:
        'https://fire.moonlet.dev/static/terms/terms-of-service.html?v=' + Date.now(),
    privacyPolicyUrl: 'https://fire.moonlet.dev/static/terms/privacy-policy.html?v=' + Date.now(),
    firebaseConfigFetchInterval: 0,
    ntpServer: 'pool.ntp.org',
    ntpPort: 123,
    extSyncUpdateStateUrl:
        'https://us-central1-moonlet-wallet-dev.cloudfunctions.net/extensionSync/updateState',
    extSyncDisconnectUrl:
        'https://us-central1-moonlet-wallet-dev.cloudfunctions.net/extensionSync/disconnect'
};

export default CONFIG;
