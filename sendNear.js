const sha256 = require('js-sha256');
const nearApi = require('near-api-js');
const fetch = require('node-fetch');

(async () => {
    const tx = {
        date: {
            created: 1596814696552,
            signed: 1596814696552,
            broadcasted: 1596814696552,
            confirmed: 1596814696552
        },
        blockchain: 'NEAR',
        chainId: 'testnet',
        type: 'TRANSFER',
        token: {
            name: 'Near',
            symbol: 'NEAR',
            icon: {},
            removable: false,
            defaultOrder: 0,
            decimals: 24,
            ui: { decimals: 4, tokenScreenComponent: 'DEFAULT' },
            type: 'NATIVE',
            units: { YNEAR: '1', NEAR: '1e+24' }
        },
        address: 'novi.testnet',
        publicKey: 'ed25519:F4vcr4uinp2ecT3MBXcmMnaA8HRmhhZrsRciFb8zPSkB', // or 'ed25519:FwY8P3MPvmzqi9ADG5RKtJ12qjqkj1Xodngc6QBKxg5C'
        toAddress: 'novii2',
        amount: '10000000000000000000000000',
        feeOptions: { gasPrice: '10000', gasLimit: '937144600000' },
        nonce: 1,
        status: 'PENDING',
        additionalInfo: {
            currentBlockHash: '7bcFCqZpW2nyDj1bA7YvMGUUFhtudbNkXEwU7tPkmDCq',
            actions: [{ type: 'TRANSFER' }]
        }
    };

    // const actions = [{ transfer: { deposit: '09195731e2ce35eb000000' }, enum: 'transfer' }];

    // this is stored in mobile
    // const privateKey =
    //     'QcrcNWpBcamx49VNsat9vHuvgTpYsruhN3xzk9MTpTG5e8Z6rofGeTn6hQbogaqjQpauU2oo7hsTuYMyGw7wXN1';

    // this is stored in chrome storage
    const keyPair = nearApi.utils.KeyPair.fromString(
        'ed25519:624p536bCLjGmAWVZeMFYM8wezmf25pDtyK47Vn7wiX2TSRJgZCsdVjc3TTHuDWuH3yDP1N7kbgXTwBgt7yD2Xee'
    );

    // create transaction
    const nearTx = nearApi.transactions.createTransaction(
        tx.address,
        nearApi.utils.PublicKey.fromString(tx.publicKey),
        tx.toAddress,
        tx.nonce,
        [{ transfer: { deposit: '09195731e2ce35eb000000' }, enum: 'transfer' }],
        nearApi.utils.serialize.base_decode(tx.additionalInfo.currentBlockHash)
    );

    // sign transaction
    const signer = {
        async signMessage(message) {
            const hash = new Uint8Array(sha256.sha256.array(message));
            return keyPair.sign(hash);
        }
    };

    const signedTx = await nearApi.transactions.signTransaction(
        nearTx,
        signer,
        tx.address,
        tx.chainId
    );

    const signedTransaction = Buffer.from(signedTx[1].encode()).toString('base64');

    // const signedTransaction =
    //     'DAAAAG5vdmkudGVzdG5ldADRBPxJyDJTZA1Fw9kmWlj14K0p65FeBUOEkknSjyfwLAEAAAAAAAAABgAAAG5vdmlpMjUcjvQqEB/28UPeFmdpsXMwYiXL1W0sbRkZi2FITWIUAQAAAAMAAABKSAEUFpVFCAAAAAAAAH7VzW0l4uNyRbNbkNIJ50IwL/XQDOAwoDvBQhG4oR/xlKT2kCqThdIykT9dn0YALh/K35wckus+EzgzKENgiQQ=';

    const res = await fetch('https://rpc.testnet.near.org', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'broadcast_tx_commit',
            params: [signedTransaction]
        })
    }).then(response => {
        return response.json();
    });

    // console.log('sendTransaction res: ', res);
    // console.log('error msg: ', res?.error?.data?.TxExecutionError);
})();
