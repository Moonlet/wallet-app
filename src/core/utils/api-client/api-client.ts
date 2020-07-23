import { HttpClient } from '../http-client';
import CONFIG from '../../../config';
import { NotificationsApiClient } from './notifications';
import { ValidatorsApiClient } from './validators';

export class ApiClient {
    public http: HttpClient;
    public notifications: NotificationsApiClient;
    public validators: ValidatorsApiClient;

    constructor() {
        this.http = new HttpClient(CONFIG.walletApiBaseUrl);
        this.notifications = new NotificationsApiClient(this);
        this.validators = new ValidatorsApiClient(this);
    }
}
