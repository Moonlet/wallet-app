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
                addToken: 'Add token',
                advanced: 'Advanced',
                advancedSetup: 'Advanced setup',
                average: 'Average',
                cancel: 'Cancel',
                cheap: 'Cheap',
                check: 'Check',
                close: 'Close',
                comingSoon: 'Coming soon!',
                confirm: 'Confirm',
                confirmPayment: 'Confirm payment',
                connect: 'Connect',
                continue: 'Continue',
                contract: 'Contract',
                contractAddress: 'Contract address',
                copy: 'Copy',
                connection: 'Connection',
                create: 'Create',
                date: 'Date',
                dateAndTime: 'Date and time',
                decimals: 'Decimals',
                delete: 'Delete',
                details: 'Details',
                delegations: 'Delegations',
                disconnect: 'Sign out',
                editToken: 'Edit token',
                error: 'Error',
                failed: 'Failed',
                fast: 'Fast',
                fastest: 'Fastest',
                fee: 'Fee',
                fees: 'Fees',
                find: 'Find',
                from: 'From',
                ledgerType: 'Ledger type',
                legal: 'Legal',
                low: 'Low',
                maybeLater: 'Maybe later',
                network: 'Network',
                next: 'Next',
                nextWord: 'Next word',
                extensionNotConnected: 'Connecting to phone',
                ok: 'OK',
                paste: 'Paste',
                privacyPolicy: 'Privacy policy',
                receive: 'Receive',
                recipient: 'Recipient',
                recover: 'Recover',
                reset: 'Reset',
                resetAll: 'Reset all',
                rewards: 'Rewards',
                save: 'Save',
                secure: 'Secure',
                security: 'Security',
                send: 'Send',
                sender: 'Sender',
                settings: 'Settings',
                setup: 'Setup',
                sign: 'Sign',
                simple: 'Simple',
                simpleSetup: 'Simple setup',
                standard: 'Standard',
                status: 'Status',
                startConnect: 'Start connect',
                statistics: 'Statistics',
                success: 'Success',
                support: 'Support',
                symbol: 'Symbol',
                tc: 'Terms & conditions',
                to: 'To',
                tools: 'Tools',
                transactions: 'Transactions',
                typeHere: 'Type here',
                understand: 'I understand',
                validators: 'Validators',
                wallets: 'Wallets',
                watch: 'Watch mode',
                youAreOn: 'You are on {{blockchain}} {{networkName}} Testnet'
                // please try to add keys in alphabetic order
            },
            buttons: {
                back: 'Back',
                clipboardBtn: 'Copy to clipboard',
                copiedBtn: 'Copied',
                done: 'Done'
            }
        },
        CreateWalletTc: {
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
            },
            password: 'Your PIN is required\nto create your Moonlet wallet'
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
            OPEN_APP: 'Please open {{app}} app on your Ledger'
        },
        Fee: {
            feeTitle: 'Transaction fee',
            gasPrice: 'Gas price',
            gasLimit: 'Gas limit',
            errorGasPrice: 'Invalid Gas Price',
            errorLimitPrice: 'Invalid Gas Limit Price'
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
            showPasscode: 'Show Passcode',
            changePinSubtitle: 'Your current PIN is required in order to change it',
            recoverWalletPinSubtitle: 'Your PIN is required\nto recover your Moonlet wallet',
            connectHardwareWalletPinSubtitle:
                'Your PIN is required\nto connect your hardware wallet'
        },
        Send: {
            REVIEW_TRANSACTION: 'Review transaction on your hardware wallet',
            OPEN_APP: 'Please open {{app}} app on your Ledger',
            BROADCASTING: 'Broadcasting transaction',
            SIGNING: 'Signing transaction',
            TR_UNDERPRICED: 'Transaction underpriced: gas price might be too low',
            NOT_ENOUGH_TOKENS: 'Insufficient funds for transaction',
            COSMOS_ERROR_12: 'Insufficient fee',
            COSMOS_ERROR_14: 'Insufficient funds for transaction',

            inputAddress: 'Search public addresses or domain names',
            memo: 'Memo (optional)',
            amount: 'Amount',
            recipientLabel: 'Recipient',
            transferOwnAccounts: 'Transfer between my accounts',
            recipientNotValid: 'Recipient address is invalid',
            genericError: 'Operation could not be completed. Check internet connection',
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
            reviewTransaction: 'Review transaction on your hardware wallet',
            addAddress: 'Add\naddress',
            enterAmount: 'Enter\namount',
            confirmTransaction: 'Confirm\ntransaction'
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
            withoutPin:
                'Without a PIN code, anyone who has access to your phone will be able to control the founds. It’s wise to setup a PIN code and secure your wallet',
            editTitle: 'Edit wallet name',
            editDescription: 'Use a relevant name or an alias for this wallet',
            addWalletTitle: 'Add Wallet',
            manageWallets: 'Manage wallets',
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
            },
            signTransaction: 'Sign transaction',
            signExtensionTransaction:
                'You are about to send {{amount}} from {{fromAccount}} to {{toAccount}}. Please review this request before taking any further action',
            signTransactionNotification: 'Send {{amount}} from {{fromAccount}} to {{toAccount}}'
        },
        Statistics: {
            launchingSoon: 'Launching soon!',
            newSection: 'A new section with stats about your wallets and accounts is in the work.'
        },
        Watch: {
            newSection: 'A new section to watch accounts is in the work.'
        },
        Settings: {
            appVersion: 'Application version',
            backupWallet: 'Backup wallet',
            blockchainPortfolio: 'Blockchain portfolio',
            defaultCurrency: 'Default currency',
            manageWallet: 'Manage wallet',
            networkOptions: 'Network options',
            privacyPolicy: 'Privacy policy',
            reportIssue: 'Report issue',
            mainnetTestnet: 'Mainnet/Testnet',
            deviceId: 'Device ID',
            copied: 'Device ID copied!',
            blockchainHasNoNetwork:
                'Network not availble. Please switch network to activate blockchain',
            changePin: 'Change PIN',
            successChangePin: 'PIN has been changed!'
        },
        NetworkOptions: {
            mainnet: 'Mainnet',
            testnet: 'Testnet',
            title: 'Network Options'
        },
        Onboarding: {
            welcomeTitle: 'Welcome to Moonlet!',
            welcomeText:
                'A blockchain agnostic, cross-platform, non custodial cryptocurrency wallet',
            welcomeTextWeb: 'To use this extension, install our mobile app and scan the code',
            webStep1: 'Open Moonlet app on your mobile',
            webStep2: 'Tap on menu icon from the header',
            webStep3: 'Select icon to start scan the code'
        },
        Account: {
            noTransactions: 'No transactions available',
            transactionHistory:
                'Transaction history will appear here once you start to send tokens to other accounts',
            manageAccount: 'Manage account'
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
            TouchID: 'TouchID',
            FingerprintLogin: 'Fingerprint login'
        },
        Extension: {
            appRequestInfo:
                'Please use the Moonlet mobile app on your phone to sign this transaction'
        },
        Token: {
            deleteToken: 'Delete token',
            searchToken: 'Search by symbol or contract address',
            noMatch: 'Nothing matches your search',
            noGiveUp: `But don't give up – check the search string you entered and give it one more try`
        },
        CreateAccount: {
            createAccount: 'Create new account!',
            chooseUsr: 'Just choose a username',
            createNear: 'Create NEAR account!',
            chooseUsername: 'Just choose a username and you’re all set.',
            congrats: 'Congrats! This name is available.',
            eg: 'e.g. johndoe',
            invalidUsername: 'Username is taken. Try something else.'
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
