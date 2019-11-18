import { ITranslations } from '../types';

export const translation: ITranslations = {
    texts: {
        App: {
            labels: {
                // plase try to add keys in alphabetic order
                accept: 'Accept',
                cancel: 'Cancel',
                close: 'Close',
                confirm: 'Confirm',
                confirmPayment: 'Confirm payment',
                connect: 'Connect',
                create: 'Create',
                delete: 'Delete',
                error: 'Error',
                date: 'Date',
                from: 'From',
                next: 'Next',
                paste: 'Paste',
                privacyPolicy: 'Privacy policy',
                receive: 'Receive',
                recover: 'Recover',
                secure: 'Secure',
                send: 'Send',
                status: 'Status',
                tos: 'Terms of service',
                transactions: 'Transactions',
                to: 'To',
                understand: 'I understand'
                // plase try to add keys in alphabetic order
            },
            buttons: {
                clipboardBtn: 'Copy to clipboard',
                copiedBtn: 'Copied',
                done: 'Done',
                back: 'Back'
            },
            screenTitles: {
                details: 'Details'
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
        SetPassword: {
            body:
                '10 or more characters long, at least 1 number, 1 lowercase character and UPPERCASE character.',
            password: 'password',
            confirmPassword: 'confirm password',
            errors: {
                passwordsDontMatch: 'Passwords dont match',
                invalidPassword: 'Invalid password'
            }
        },
        SetPasswordConfirm: {
            body: 'You need to setup a password to secure your wallet.',
            checkboxLabel:
                'Do not lose this password. Moonlet will not be able to reset it for you.'
        },
        Send: {
            inputAddress: 'Search public addresses or domain names',
            amount: 'Amount',
            recipientLabel: 'Recipient',
            transferOwnAccounts: 'Transfer between my accounts'
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
            deletePasswordRequest: 'Please type your password to delete your wallet.',
            unveilPasswordRequest: 'Please type your password to unveil your recovery phrase.',
            invalidPassword: 'Invalid Password',
            viewPhrase: 'View phrase'
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
