import { AbstractWsClient } from '../common/abstract-ws-client';
import { WsEvent } from '../types';
import { networks } from './networks';

export class WsClient extends AbstractWsClient {
    constructor(chainId: string) {
        super(networks, chainId);
    }

    onMessage(msg) {
        if (msg.type === 'Notification' && Array.isArray(msg.values)) {
            for (const value of msg.values) {
                switch (value.query) {
                    case 'NewBlock':
                        const blockNumber = value?.value?.TxBlock?.header?.BlockNum;
                        if (blockNumber) {
                            this.emit(WsEvent.NEW_BLOCK, blockNumber);
                        }
                        break;
                    case 'TxnLog':
                        const transactions = value?.value;
                        if (transactions) {
                            this.emit(WsEvent.TXN_LOG, transactions);
                        }
                        break;
                }
            }
        }
    }

    onNewBlock(cb) {
        return this.subscribe(
            WsEvent.NEW_BLOCK,
            {
                sub: { query: 'NewBlock' },
                unsub: {
                    query: 'Unsubscribe',
                    type: 'NewBlock'
                }
            },
            cb
        );
    }

    onTxnLog(addresses: string[], cb) {
        return this.subscribe(
            WsEvent.TXN_LOG,
            {
                sub: { query: 'TxnLog', addresses },
                unsub: {}
            },
            cb
        );
    }
}
