import { Deferred } from './../../utils/deferred';

import { IBlockchainNetwork, WsEvent } from '../types';
import { PubSub } from './pub-sub';

export abstract class AbstractWsClient {
    protected url: string;

    private ws: WebSocket;
    private wsConnectionDeferred: Deferred;
    private pubSub: PubSub<WsEvent> = new PubSub();

    constructor(networks: IBlockchainNetwork[], chainId: string) {
        this.url = networks.find(n => n.chainId === Number(chainId))?.wsUrl || '';
        this.openConnection();
    }

    private openConnection() {
        this.wsConnectionDeferred = new Deferred();
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener('open', () => {
            this.wsConnectionDeferred.resolve();
        });
        this.ws.addEventListener('close', () => {
            setTimeout(() => this.reconnect(), 5000);
        });
        this.ws.addEventListener('message', msg => {
            try {
                this.onMessage(JSON.parse(msg.data));
            } catch (e) {
                //
            }
        });
        this.ws.addEventListener('error', error => {
            //
        });
    }

    private reconnect() {
        this.openConnection();
        for (const event of this.pubSub.getEvents()) {
            const meta = this.pubSub.getMeta(event);
            meta.sub && this.sendMessage(meta.sub);
        }
    }

    protected async sendMessage(msg) {
        try {
            await this.wsConnectionDeferred.promise;
            this.ws.send(JSON.stringify(msg));
        } catch (e) {
            //
        }
    }

    protected abstract onMessage(msg);

    protected emit(event: WsEvent, data: any) {
        this.pubSub.emit(event, data);
    }

    protected subscribe(
        event: WsEvent,
        wsMessage: { sub: any; unsub: any },
        cb: (data) => void
    ): () => void {
        this.sendMessage(wsMessage.sub); // subscribe
        const unsub = this.pubSub.subscribe(event, cb, wsMessage);

        return () => {
            unsub();
            if (!this.pubSub.hasSubscribers(event)) {
                this.sendMessage(wsMessage.unsub); // unsub for event
            }
        };
    }
}
