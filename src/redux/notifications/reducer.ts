import { INotificationsState } from './state';
import { IAction } from '../types';
import { Blockchain } from '../../core/blockchain/types';

// TODO: remove this
const initialState: INotificationsState = {
    [Blockchain.ZILLIQA]: {
        notif1: {
            title: 'Claim your reward now',
            subtitle: 'You have 500.00 ZIL available to be claimed',
            read: false
        },
        notif2: {
            title: 'Transaction failed',
            subtitle: '10.0000 ZIL failed to be sent to the following address: zil1f...lsd7t',
            read: false
        },
        notif3: {
            title: 'Transaction sent',
            subtitle: '10.0000 ZIL sent to the following address: zil1f...lsd7t',
            read: false
        }
    },
    [Blockchain.ETHEREUM]: {
        notif1: {
            title: 'Transaction sent',
            subtitle: '10.0000 ZIL sent to the following address: zil1f...lsd7t',
            read: true
        }
    }
};

export default (
    state: INotificationsState = initialState,
    action: IAction
): INotificationsState => {
    switch (action.type) {
        default:
            break;
    }
    return state;
};
