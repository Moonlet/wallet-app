import { ITranslations } from '../types';

export const translation: ITranslations = {
    texts: {
        App: {
            labels: {
                // please try to add keys in alphabetic order
                about: 'About',
                accept: 'Accept',
                accounts: 'Accounts',
                advanced: 'Advanced',
                cancel: 'Cancel',
                cheap: 'Cheap',
                close: 'Close',
                confirm: 'Confirm',
                confirmPayment: 'Confirm payment',
                connect: 'Connect',
                create: 'Create',
                date: 'Date',
                delete: 'Delete',
                details: 'Details',
                error: 'Error',
                fast: 'Fast',
                fastest: 'Fastest',
                fee: 'Fee',
                from: 'From',
                legal: 'Legal',
                next: 'Next',
                paste: 'Paste',
                privacyPolicy: 'Privacy policy',
                receive: 'Receive',
                recover: 'Recover',
                rewards: 'Rewards',
                save: 'Save',
                secure: 'Secure',
                security: 'Security',
                send: 'Send',
                settings: 'Settings',
                setup: 'Setup',
                simple: 'Simple',
                standard: 'Standard',
                status: 'Status',
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
            selectDevice: 'Device: ',
            NANO_X: 'Ledger Nano X',
            NANO_S: 'Ledger Nano S',
            openAppOnDevice: 'Make sure you have opened the ',
            onDevice: ' app on your hardware wallet',

            verifyAddress: 'Verify address on your device'
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
            pinSubtitleUnlock: 'Your PIN is required to unlock Moonlet',
            invalidPassword: 'Invalid Password',
            genericError: 'Operation could not be completed',
            subtitleMnemonic: 'Your PIN is required to view mnemonic',
            subtitleDeleteWallet: 'Your PIN is required to delete wallet',
            dontMatch: "PIN code doesn't match",
            termsBody: 'You need to setup a password to secure your wallet.',
            termsCheckboxLabel:
                'Do not lose this password. Moonlet will not be able to reset it for you.'
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
            editContactName: 'Edit name'
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
            editDescription: 'Use a relevant name or an alias for this wallet'
        },
        Transaction: {
            transactionID: 'Transaction ID',
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
            touchID: 'TouchID'
        },
        NetworkOptions: {
            mainnet: 'Mainnet',
            testnet: 'Testnet',
            title: 'Network Options'
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
