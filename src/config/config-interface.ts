export interface IAppConfig {
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
        updateStateUrl: string;
        disconnectUrl: string;
        sendRequestUrl: string;
        sendResponseUrl: string;
        deleteRequestUrl: string;
    };
    firebaseWebConfig: any;
}
