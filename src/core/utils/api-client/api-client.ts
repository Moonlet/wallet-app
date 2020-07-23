import { HttpClient } from '../http-client';
import CONFIG from '../../../config';
import { NotificationsApiClient } from './notifications';
import { ValidatorsApiClient } from './validators';

export class ApiClient {
    public httpClient: HttpClient;
    public notifications: NotificationsApiClient;
    public validators: ValidatorsApiClient;

    constructor() {
        this.httpClient = new HttpClient(CONFIG.walletApiBaseUrl);
        this.notifications = new NotificationsApiClient(this);
        this.validators = new ValidatorsApiClient(this);
    }
}
