import { IAppConfig } from './config-interface';

export const CONFIG: IAppConfig = {
    supportUrl: 'https://moonlet.xyz/links/support',
    env: process.env.MOONLET_SOME_KEY,
    tokensUrl: 'https://static.moonlet.dev/tokens/',
    firebaseConfigFetchInterval: 0,
    ntpServer: 'pool.ntp.org',
    ntpPort: 123
};

export default CONFIG;
