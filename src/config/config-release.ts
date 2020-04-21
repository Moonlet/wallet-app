import { IAppConfig } from './config-interface';

export const CONFIG: IAppConfig = {
    supportUrl: 'https://moonlet.xyz/links/support',
    env: process.env.MOONLET_SOME_KEY,
    tokensUrl: 'https://fire.moonlet.io/static/tokens/',
    dataApiUrl: 'https://api.moonlet.io/data',
    termsAndConditionsUrl: 'https://fire.moonlet.io/static/terms/terms-of-service.html',
    privacyPolicyUrl: 'https://fire.moonlet.io/static/terms/privacy-policy.html',
    firebaseConfigFetchInterval: 15 * 60, // 15 mins
    ntpServer: 'pool.ntp.org',
    ntpPort: 123
};

export default CONFIG;
