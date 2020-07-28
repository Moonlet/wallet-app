export interface IAppConfig {
    walletApiBaseUrl: string;
    supportUrl: string;
    env: string;
    tokensUrl: string;
    dataApiUrl: string;
    firebaseConfigFetchInterval: number;
    termsAndConditionsUrl: string;
    privacyPolicyUrl: string;
    ntpServer: string;
    ntpPort: number;
    extSync: {
        bucket: string;
        updateStateUrl: string;
        disconnectUrl: string;
        sendRequestUrl: string;
        sendResponseUrl: string;
        deleteRequestUrl: string;
    };
    firebaseWebConfig: any;
}
