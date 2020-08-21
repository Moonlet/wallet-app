import { HttpClient } from '../http-client';
import CONFIG from '../../../config';
import { NotificationsApiClient } from './notifications';
import { ValidatorsApiClient } from './validators';
import { NearApiClient } from './near';

export class ApiClient {
    public http: HttpClient;
    public notifications: NotificationsApiClient;
    public validators: ValidatorsApiClient;
    public near: NearApiClient;

    constructor() {
        this.http = new HttpClient(CONFIG.walletApiBaseUrl);
        this.notifications = new NotificationsApiClient(this);
        this.validators = new ValidatorsApiClient(this);
        this.near = new NearApiClient(this);
    }
}
