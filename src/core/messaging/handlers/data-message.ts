import { updateTransactionFromBlockchain } from '../../../redux/wallets/actions';
import { store } from '../../../redux/config';
import { ISilentMessage, SilentMessageType } from '../types';
import { takeOneAndSubscribeToStore } from '../../../redux/utils/helpers';

export const dataMessageHandler = async (message: ISilentMessage) => {
    // check here is app is in foreground ?

    // this is entry point for backgorund messaging
    takeOneAndSubscribeToStore(store, (state, unsub) => {
        if (store.getState()._persist.rehydrated) {
            unsub && unsub();
            handleMessages(message);
        }
    });
};

const handleMessages = (message: ISilentMessage) => {
    switch (message.type) {
        case SilentMessageType.TRANSACTION:
            const data = JSON.parse(message.data);

            // @ts-ignoreasdasd
            store.dispatch(
                updateTransactionFromBlockchain(data.transactionHash, data.blockchain, true)
            );
            break;

        default:
            break;
    }
};
