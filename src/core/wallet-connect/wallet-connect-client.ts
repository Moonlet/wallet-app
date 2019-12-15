import RNWalletConnect from '@walletconnect/react-native';

export const WalletConnectClient = (() => {
    let walletConnector: RNWalletConnect;

    const connect = (connectionString: string) => {
        walletConnector && walletConnector.killSession;

        walletConnector = new RNWalletConnect(
            {
                uri: connectionString
            },
            {
                clientMeta: {
                    description: 'Moonlet Wallet App',
                    url: 'https://moonlet.xyz/',
                    name: 'Moonlet',
                    // @ts-ignore
                    ssl: true
                }
            }
        );

        walletConnector.on('session_request', (error, payload) => {
            if (error) {
                throw error;
            }

            walletConnector.approveSession({
                accounts: ['0x1b6c705252438d59DB3ADB85e3B91374377a20c9'],
                chainId: 1 // required
            });
        });

        // Subscribe to call requests
        walletConnector.on('call_request', (error, payload) => {
            if (error) {
                throw error;
            }

            // console.log(payload);
        });

        walletConnector.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }

            // console.log(payload);
        });
    };

    const sendMessage = (method: string, payload: any) => {
        if (!walletConnector.connected) {
            return Promise.reject('Not connected');
        }

        return new Promise((resolve, reject) => {
            walletConnector.sendCustomRequest({ method, params: [payload] }).then(data => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data.result);
                }
            });
        });
    };

    const disconnect = () => {
        walletConnector.killSession();
    };

    return {
        connect,
        disconnect,
        sendMessage
    };
})();
