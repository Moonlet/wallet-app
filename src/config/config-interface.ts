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
    extSyncUpdateStateUrl: string;
    extSyncDisconnectUrl: string;
    firebaseConfig: any;
}
