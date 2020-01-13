import { ITranslations } from '../types';

export const translation: ITranslations = {
    texts: {
        App: {
            labels: {
                // please try to add keys in alphabetic order
                about: 'About',
                accept: 'Accept',
                account: 'Account',
                accounts: 'Accounts',
                advanced: 'Advanced',
                cancel: 'Cancel',
                cheap: 'Cheap',
                close: 'Close',
                comingSoon: 'Coming soon!',
                confirm: 'Confirm',
                confirmPayment: 'Confirm payment',
                connect: 'Connect',
                copy: 'Copy',
                connection: 'Connection',
                create: 'Create',
                date: 'Date',
                dateAndTime: 'Date and time',
                delete: 'Delete',
                details: 'Details',
                error: 'Error',
                failed: 'Failed',
                fast: 'Fast',
                fastest: 'Fastest',
                fee: 'Fee',
                from: 'From',
                ledgerType: 'Ledger type',
                legal: 'Legal',
                network: 'Network',
                next: 'Next',
                nextWord: 'Next word',
                paste: 'Paste',
                privacyPolicy: 'Privacy policy',
                receive: 'Receive',
                recipient: 'Recipient',
                recover: 'Recover',
                resetAll: 'Reset all',
                rewards: 'Rewards',
                save: 'Save',
                secure: 'Secure',
                security: 'Security',
                send: 'Send',
                sender: 'Sender',
                settings: 'Settings',
                setup: 'Setup',
                simple: 'Simple',
                standard: 'Standard',
                status: 'Status',
                startConnect: 'Start connect',
                support: 'Support',
                tc: 'Terms & conditions',
                to: 'To',
                tools: 'Tools',
                transactions: 'Transactions',
                understand: 'I understand',
                wallets: 'Wallets',
                watch: 'Watch'
                // plase try to add keys in alphabetic order
            },
            buttons: {
                back: 'Back',
                clipboardBtn: 'Copy to clipboard',
                copiedBtn: 'Copied',
                done: 'Done'
            }
        },
        CreateWalletTos: {
            body: 'Make sure you review our Privacy policy and Terms & conditions'
        },
        CreateWalletMnemonic: {
            body:
                'Please save the recovery phrase and keep it in a safe place. The recovery phrase is the only way to restore your Moonlet wallet in case you lose your phone or forget your password.'
        },
        CreateWalletMnemonicConfirm: {
            body:
                'To make sure you have written down all of your recovery words, please enter the following:',
            errors: {
                tryAgain: 'Please try again'
            }
        },
        CreateHardwareWallet: {
            device: 'Device: {{device}}',
            NANO_X: 'Ledger Nano X',
            NANO_S: 'Ledger Nano S',
            app:
                'Make sure you have opened {{app}} app on your Ledger before starting the connect.',
            verifyAddress: 'Verify {{app}} address on your Ledger',
            notSupported: 'Feature is not supported',
            USB: 'Cable',
            U2F: 'U2F', // TODO
            BLE: 'Bluetooth',
            scanningDevices: 'Scanning for ledger device',
            paired: 'has been paired',
            openApp: 'Please open {{app}} app on your Ledger',
            ETHEREUM: 'Ethereum',
            ZILLIQA: 'Zilliqa'
        },
        Fee: {
            feeTitle: 'Transaction fee',
            gasPrice: 'Gas price',
            gasLimit: 'Gas limit'
        },
        Password: {
            setupPinTitle: 'Setup PIN code',
            setupPinSubtitle: 'Please enter your new PIN code',
            verifyPinTitle: 'Verify PIN code',
            verifyPinSubtitle: 'Please re-enter your new PIN code',
            pinTitleUnlock: 'Enter PIN code',
            pinSubtitleUnlock: 'Your PIN is required\nto unlock Moonlet',
            invalidPassword: 'Invalid Password',
            genericError: 'Operation could not be completed',
            subtitleMnemonic: 'Your PIN is required to view mnemonic',
            subtitleDeleteWallet: 'Your PIN is required to delete wallet',
            dontMatch: "PIN code doesn't match",
            termsBody: 'You need to setup a PIN to secure your wallet.',
            termsCheckboxLabel:
                'Do not lose this PIN. Moonlet will not be able to reset it for you.',
            authRequired: 'Authentication Required',
            authToContinue: 'Authenticate to continue',
            touchSensor: 'Touch sensor',
            showPasscode: 'Show Passcode'
        },
        Send: {
            inputAddress: 'Search public addresses or domain names',
            amount: 'Amount',
            recipientLabel: 'Recipient',
            transferOwnAccounts: 'Transfer between my accounts',
            recipientNotValid: 'Recipient address is invalid',
            insufficientFunds: 'Insufficient funds',
            receipientWarning: 'Warning: recipient address is not checksumed',
            allBalance: 'Add all balance',
            cameraDisabledTitle: 'Enable camera',
            cameraDisabledText: 'Please enable camera on device settings',
            emptyAddress: 'Your address book is empty',
            addAddressBook: 'Start to add public addresses or domain names to your address book',
            addressNotInBook:
                'It looks that this address is not on your address book. Click here to add it!',
            alertTitle: 'Add it to address book',
            alertDescription: 'Use a relevant name or an alias for this new address',
            alertEditTitle: 'Edit address book name',
            alertEditDescription: 'Use a relevant name or an alias for this address',
            deleteContact: 'Delete contact',
            editContactName: 'Edit name',
            reviewTransaction: 'Review transaction on your hardware wallet'
        },
        AccountSettings: {
            manageAccount: 'Manage account',
            revealPrivate: 'Reveal private key',
            revealPublic: 'Reveal public key',
            viewOn: 'View on ',
            reportIssue: 'Report issue',
            securityTip:
                'Security tip: Never disclosure your private key. Anyone with this key can take your funds forever.'
        },
        Wallets: {
            deleteWallet: 'Delete wallet',
            unveil: 'Unveil phrase',
            editName: 'Edit name',
            confirmDelete:
                'Make sure you have saved securely your recovery phrase before deleting it',
            viewPhrase: 'Reveal secret phrase',
            secureWallet: 'Secure wallet',
            editTitle: 'Edit wallet name',
            editDescription: 'Use a relevant name or an alias for this wallet',
            addWalletTitle: 'Add Wallet',
            connectLedger: 'Connect your Ledger!',
            quicklyConnectLedger: 'Quickly connect your Ledger and manage your assests'
        },
        Transaction: {
            transactionID: 'Transaction ID',
            transactionDetails: 'Transaction details',
            transactionStatus: 'Transaction status',
            nonce: 'Nonce',
            statusValue: {
                Pending: 'Pending',
                Failed: 'Failed',
                Dropped: 'Dropped',
                Success: 'Success'
            }
        },
        Rewards: {
            launchingSoon: 'Launching soon!',
            newSection: 'A new section to get rewards by staking your tokens is in the work.'
        },
        Settings: {
            appVersion: 'Application version',
            backupWallet: 'Backup wallet',
            blockchainPortfolio: 'Blockchain portfolio',
            defaultCurrency: 'Default currency',
            manageWallet: 'Manage wallet',
            networkOptions: 'Network options',
            pinLogin: 'Pin Login',
            privacyPolicy: 'Privacy policy',
            reportIssue: 'Report issue',
            signOut: 'Sign out',
            mainnetTestnet: 'Mainnet/Testnet'
        },
        NetworkOptions: {
            mainnet: 'Mainnet',
            testnet: 'Testnet',
            title: 'Network Options'
        },
        Onboarding: {
            welcomeTitle: 'Welcome to Moonlet!',
            welcomeText: 'We’ll generate this section once you create, recover or connect a wallet',
            welcomeTextWeb:
                'To use Moonlet extension:\n1. Open Moonlet app on your phone \n2. Tap this and that\n3. Scan this QR Code'
        },
        Account: {
            noTransactions: 'No transactions available',
            transactionHistory:
                'Transaction history will appear here once you start to send tokens to other accounts'
        },
        DashboardMenu: {
            transactionHistory: 'Transaction history',
            checkTransactions: 'Check all your transactions',
            manageAccount: 'Manage account',
            quicklyManage: 'Quickly edit, order or hide your accounts',
            connectExtension: 'Connect to extension',
            scanCode: 'Scan the QR code on extension'
        },
        BackupWallet: {
            title: 'Backup Wallet',
            workInProgress: 'A backup/recovery system\nis in the work.'
        },
        BiometryType: {
            FaceID: 'FaceID',
            TouchID: 'TouchID'
        }
    },
    plural: (n: number, ord?: boolean) => {
        const s = String(n).split('.');
        const v0 = !s[1];
        const t0 = Number(s[0]) === n;
        const n10 = t0 && s[0].slice(-1);
        const n100 = t0 && s[0].slice(-2);

        if (ord) {
            return n10 === '1' && n100 !== '11'
                ? 'one'
                : n10 === '2' && n100 !== '12'
                ? 'two'
                : n10 === '3' && n100 !== '13'
                ? 'few'
                : 'other';
        }
        return n === 1 && v0 ? 'one' : 'other';
    }
};
