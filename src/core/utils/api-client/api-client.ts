import { HttpClient } from '../http-client';
import CONFIG from '../../../config';
import { NotificationsApiClient } from './notifications';
import { ValidatorsApiClient } from './validators';
import { ConfigsApiClient } from './configs';
import { GovernanceApiClient } from './governance';

export class ApiClient {
    public http: HttpClient;
    public notifications: NotificationsApiClient;
    public validators: ValidatorsApiClient;
    public configs: ConfigsApiClient;
    public governance: GovernanceApiClient;

    constructor() {
        this.http = new HttpClient(CONFIG.walletApiBaseUrl);
        this.notifications = new NotificationsApiClient(this);
        this.validators = new ValidatorsApiClient(this);
        this.configs = new ConfigsApiClient(this);
        this.governance = new GovernanceApiClient(this);
    }
}
