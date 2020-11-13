// tslint:disable-next-line:no-console
import { store } from '../../src/redux/config';
import { wrapStore } from 'webext-redux';

wrapStore(store, {
    portName: 'moonlet-extension-store-port'
});
