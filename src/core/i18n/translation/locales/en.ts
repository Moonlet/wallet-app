import { ITranslations } from '../types';

export const translation: ITranslations = {
    texts: {
        App: {
            labels: {
                // plase try to add keys in alphabetic order
                accept: 'Accept',
                advanced: 'Advanced',
                cancel: 'Cancel',
                close: 'Close',
                confirm: 'Confirm',
                confirmPayment: 'Confirm payment',
                connect: 'Connect',
                create: 'Create',
                cheap: 'Cheap',
                delete: 'Delete',
                details: 'Details',
                error: 'Error',
                date: 'Date',
                fast: 'Fast',
                fastest: 'Fastest',
                from: 'From',
                fee: 'Fee',
                next: 'Next',
                paste: 'Paste',
                privacyPolicy: 'Privacy policy',
                receive: 'Receive',
                recover: 'Recover',
                secure: 'Secure',
                send: 'Send',
                settings: 'Settings',
                simple: 'Simple',
                status: 'Status',
                standard: 'Standard',
                tc: 'Terms and conditions',
                tos: 'Terms of service',
                transactions: 'Transactions',
                to: 'To',
                understand: 'I understand',
                wallets: 'Wallets'
                // plase try to add keys in alphabetic order
            },
            buttons: {
                clipboardBtn: 'Copy to clipboard',
                copiedBtn: 'Copied',
                done: 'Done',
                back: 'Back'
            }
        },
        CreateWalletTos: {
            body: 'Make sure you review our Privacy policy and Terms of service'
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
            cameraDisabledText: 'Please enable camera on device settings'
        },
        AccountSettings: {
            manageAccount: 'Manage account',
            revealPrivate: 'Reveal private key',
            revealPublic: 'Reveal public key',
            viewOn: 'View on ',
            reportIssue: 'Report issue',
            securityTip: 'Security tip: Never disclosure your private key.',
            securityTip2: 'Anyone with this key can take your funds forever.'
        },
        Wallets: {
            deleteWallet: 'Delete wallet',
            unveil: 'Unvail phrase',
            editName: 'Edit name',
            confirmDelete:
                'Make sure you have saved securely your recovery phrase before deleting it',
            viewPhrase: 'View phrase',
            secureWallet: 'Secure wallet'
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
            title: 'Rewards',
            launchingSoon: 'Launching soon!',
            newSection: 'A new section to get rewards by staking your tokens is in the work.'
        },
        Watch: {
            title: 'Watch'
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
