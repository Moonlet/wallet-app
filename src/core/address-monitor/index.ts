import { Notifications } from '../messaging/notifications/notifications';
import { Blockchain } from '../blockchain/types';
import DeviceInfo from 'react-native-device-info';
import { IWalletsState, IAccountState } from '../../redux/wallets/state';
import { CONFIG } from '../../config';
import { HttpClient } from '../utils/http-client';

const url = CONFIG.walletApiBaseUrl + '/data//notifications/register';
const http = new HttpClient(url);
const monitoredBlockchains = [Blockchain.ETHEREUM, Blockchain.ZILLIQA];

export const updateAddressMonitorTokens = (wallets: IWalletsState) => {
    const addresses = {};

    Object.keys(wallets || []).forEach(id => {
        wallets[id].accounts.forEach((account: IAccountState) => {
            if (monitoredBlockchains.indexOf(account.blockchain) !== -1) {
                if (!addresses[account.blockchain]) {
                    addresses[account.blockchain] = [];
                }

                addresses[account.blockchain].push(account.address);
            }
        });
    });

    const requestAddresses = Object.keys(addresses).map(blockchain => ({
        blockchain,
        addresses: addresses[blockchain]
    }));

    const deviceId = DeviceInfo.getUniqueId();
    Notifications.getToken().then(token => {
        http.post('', {
            deviceId,
            tokenType: 'fcm',
            token,
            addresses: requestAddresses
        });
    });
};
