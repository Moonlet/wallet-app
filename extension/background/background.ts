process.env.CONTEXT = 'extension-background';


import { store } from '../../src/redux/config';
import { wrapStore } from 'webext-redux';

import firebase from 'firebase/app';
import CONFIG from '../../src/config';

import { Controllers } from './controllers';


// initialize store
firebase.initializeApp(CONFIG.firebaseWebConfig);

// wrap store
wrapStore(store, {
    portName: 'moonlet-extension-store-port'
});

// init controllers
Controllers.init();
const controllers = Controllers.get();

// trigger firebase sync
controllers.WalletSyncController.extensionConnected();


