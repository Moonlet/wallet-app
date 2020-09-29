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
                activate: 'Activate',
                add: 'Add',
                addToken: 'Add token',
                advanced: 'Advanced',
                advancedSetup: 'Advanced setup',
                all: 'All',
                amount: 'Amount',
                average: 'Average',
                balance: 'Balance',
                cancel: 'Cancel',
                canceled: 'Canceled',
                cheap: 'Cheap',
                check: 'Check',
                close: 'Close',
                claim: 'Claim',
                claimReward: 'Claim reward',
                claimingRewards: 'Claiming rewards',
                comingSoon: 'Coming soon!',
                confirm: 'Confirm',
                confirmPayment: 'Confirm payment',
                connect: 'Connect',
                connection: 'Connection',
                continue: 'Continue',
                contract: 'Contract',
                contractAddress: 'Contract address',
                copy: 'Copy',
                create: 'Create',
                createTicket: 'Create a ticket',
                date: 'Date',
                dateAndTime: 'Date and time',
                decimals: 'Decimals',
                delegate: 'Delegate',
                delegations: 'Delegations',
                delete: 'Delete',
                deposit: 'Deposit',
                details: 'Details',
                disconnect: 'Sign out',
                dropped: 'Dropped',
                enterAmount: 'Enter\namount',
                editToken: 'Edit token',
                error: 'Error',
                extensionNotConnected: 'Connecting to phone',
                failed: 'Failed',
                fast: 'Fast',
                fastest: 'Fastest',
                fee: 'Fee',
                fees: 'Fees',
                find: 'Find',
                for: 'For',
                from: 'From',
                half: 'Half',
                holdUnveil: 'Hold to unveil',
                ledgerType: 'Ledger type',
                legal: 'Legal',
                locking: 'Locking',
                low: 'Low',
                maybeLater: 'Maybe later',
                mnemonicNotValid: 'Your mnemonic is not valid!',
                myVotes: 'My Votes',
                myStakes: 'My Stakes',
                network: 'Network',
                next: 'Next',
                nextWord: 'Next word',
                notifications: 'Notifications',
                ok: 'OK',
                paste: 'Paste',
                processing: 'Processing',
                privacyPolicy: 'Privacy policy',
                quickDelegate: 'Quick Delegate',
                quickVote: 'Quick Vote',
                quickStake: 'Quick Stake',
                receive: 'Receive',
                recipient: 'Recipient',
                recover: 'Recover',
                redelegate: 'Redelegate',
                reinvest: 'Reinvest',
                refreshing: 'Refreshing',
                remove: 'Remove',
                removeAccount: 'Remove account',
                retry: 'Retry',
                reset: 'Reset',
                resetAll: 'Reset all',
                restake: 'Restake',
                revote: 'Revote',
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
                stake: 'Stake',
                staked: 'Staked',
                startConnect: 'Start connect',
                statistics: 'Statistics',
                status: 'Status',
                success: 'Success',
                summary: 'Summary',
                support: 'Support',
                symbol: 'Symbol',
                tc: 'Terms of Service',
                to: 'To',
                tools: 'Tools',
                theRequested: 'the requested',
                transactions: 'Transactions',
                transfer: 'Transfer',
                tryAgain: 'Try again',
                typeHere: 'Type here',
                understand: 'I understand',
                undelegate: 'Undelegate',
                unvote: 'Unvote',
                unlock: 'Unlock',
                unlocking: 'Unlocking',
                unvoting: 'Unvoting',
                unstake: 'Unstake',
                unstaking: 'Unstaking',
                validators: 'Validators',
                vote: 'Vote',
                voting: 'Voting',
                wallets: 'Wallets',
                warning: 'Warning',
                watch: 'Watch mode',
                withdraw: 'Withdraw',
                youAreOn: 'You are on {{blockchain}} {{networkName}} Testnet',
                youAreUsing: 'You are now using your'
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
            body: 'Make sure you review our\nPrivacy policy and Terms of Service'
        },
        CreateWalletMnemonic: {
            body:
                'Please save the recovery phrase and keep it in a safe place. The recovery phrase is the only way to restore your Moonlet wallet in case you lose your phone or forget your password.',
            title:
                'Here’s your recovery phrase. Please write all {{mnemonicLength}} words down and keep them safe.',
            mnemonicInfo: 'Write down the words from {{from}} to {{to}}:',
            terms:
                'The recovery phrase is the only way to restore your Moonlet wallet in case you lose your phone or forget your password. Don’t lose it!',
            copy: 'Copy entire mnemonic'
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
            app:
                'Make sure you have opened {{app}} app on your Ledger before starting the connect.',
            verifyAddress: 'Verify {{app}} address on your Ledger',
            notSupported: 'Feature is not supported',
            USB: 'Cable',
            U2F: 'U2F', // TODO
            BLE: 'Bluetooth',
            scanningDevices: 'Scanning for ledger device',
            paired: 'has been paired',
            openApp: 'Open {{app}} app on your Ledger to continue...'
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
            invalidPasswordAtttempts: {
                text: 'Invalid Password\nYou have {{attempts}} attempts left',
                ordinal: false,
                forms: {
                    one: 'Invalid Password\nYou have 1 attempt left'
                }
            },
            invalidPasswordLastAttempt: `You have only 1 attempt left.\nIf you fail, all your data will be cleared and you'll need your secret phrases to restore your wallets.`,
            genericError: 'Operation could not be completed',
            subtitleMnemonic: 'Your PIN is required to view mnemonic',
            subtitleDeleteWallet: 'Your PIN is required to delete wallet',
            subtitleSignTransaction: 'Your PIN is required\nto sign your transaction',
            dontMatch: "PIN code doesn't match",
            termsBody: 'You need to setup a PIN to secure your wallet.',
            termsCheckboxLabel:
                'Do not lose this PIN. Moonlet will not be able to reset it for you.',
            authRequired: 'Authentication Required',
            authToContinue: 'Authenticate to continue',
            touchSensor: 'Touch sensor',
            showPasscode: 'Show Passcode',
            changePinSubtitle: 'Your current PIN is required in order to change it',
            moonletDisabled: 'Moonlet is disabled',
            disabledDetails: 'try again in {{duration}} {{measurement}}',
            disabledDetailsSeconds: 'try again in a few seconds',
            activateInternet: 'Please activate the internet connection',
            alreadyHavePin: 'You already have this PIN!\nPlease choose another one'
        },
        Time: {
            second: {
                text: 'seconds',
                ordinal: false,
                forms: {
                    one: 'second'
                }
            },
            minute: {
                text: 'minutes',
                ordinal: false,
                forms: {
                    one: 'minute'
                }
            },
            hour: {
                text: 'hours',
                ordinal: false,
                forms: {
                    one: 'hour'
                }
            },
            day: {
                text: 'days',
                ordinal: false,
                forms: {
                    one: 'day'
                }
            }
        },
        Send: {
            inputAddress: 'Paste your address here or scan the QR code',
            inputAddressExt: 'Paste your address here',
            memo: 'Memo (optional)',
            amount: 'Amount',
            recipientLabel: 'Recipient',
            transferOwnAccounts: 'Transfer between my accounts',
            recipientNotValid: 'Recipient address is invalid',
            genericError: 'Operation could not be completed. Check internet connection',
            insufficientFunds: 'Insufficient funds',
            mimimumAmount: 'Minimum amount is {{value}} {{coin}}',
            insufficientFundsFees: 'Insufficient funds for fees',
            receipientWarning: 'Warning: recipient address is not checksumed',
            allBalance: 'All balance: ',
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
                'Without a PIN code, anyone who has access to your phone will be able to control the funds. It’s wise to setup a PIN code and secure your wallet',
            editTitle: 'Edit wallet name',
            editDescription: 'Use a relevant name or an alias for this wallet',
            addWalletTitle: 'Add Wallet',
            manageWallets: 'Manage wallets',
            connectLedger: 'Connect your Ledger!',
            quicklyConnectLedger: 'Quickly connect your Ledger and manage your assests',
            connectWallet: 'Manage your wallets',
            quicklyConnectWallet: 'Quickly create or recover your wallet and manage your assets'
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
            signTransactionNotification: 'Send {{amount}} from {{fromAccount}} to {{toAccount}}',
            processTitleText: 'Please wait while each transaction is being processed!',
            processTitleTextLedger:
                'Please sign each transaction from your Ledger and wait while is being processed!',
            registerAccount: 'Registering account',
            transactionType: 'Transaction Type'
        },
        Statistics: {
            launchingSoon: 'Launching soon!',
            newSection: 'A new section with stats about your wallets and accounts is in the work.'
        },
        Watch: {
            newSection: 'A new section to watch accounts is in the work.'
        },
        SmartScan: {
            title: 'Smart scan',
            newSection: 'A new section of smart scannig is in the work.'
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
            networkNotAvailable: 'Network not available',
            switchNetwork: 'Please switch network to activate blockchain',
            cannotDeactivateAllBlockchains: 'You cannot deactivate all active blockchains',
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
            webStep3: 'Scan the QR code to connect'
        },
        Account: {
            noTransactions: 'No transactions available',
            transactionHistory:
                'Transaction history will appear here once you start to send tokens to other accounts',
            manageAccounts: 'Manage accounts'
        },
        DashboardMenu: {
            transactionHistory: 'Transaction history',
            connectExtension: 'Connect to extension',
            scanPay: 'Scan to pay',
            switchWallets: 'Switch between the wallets anytime',
            connectedWebsites: 'Connected websites',
            tokenSwap: 'Token swap (coming soon)',
            copyToClipboard: 'Copy address to clipboard'
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
            noGiveUp: `But don't give up – check the search string you entered and give it one more try`,
            searchValidators: 'Search for validators'
        },
        AddAccount: {
            title: 'Add account',
            eg: 'e.g. johndoe',
            addNearAccount: 'Add account ({{activeAccountsNumber}}/{{maxAccountsNumber}})',
            checking: 'Checking availability ...',
            removeAccountConfirm: 'You’re about to remove {{name}} from Moonlet',
            invalid: 'Account name CANNOT contain characters "@" or "."',
            notAvailable: 'Account name not available. Try something else.'
        },
        CreateNearAccount: {
            title: 'Create account name',
            chooseAccountName: 'Choose an account name and you’re all set.',
            congrats: 'Congrats! {{name}} is available.',
            failed: 'Create account has failed',
            tryAgain: 'Try again!'
        },
        RecoverNearAccount: {
            title: 'Recover account name',
            authMoonletUserAccount: 'Authorize Moonlet to use your existing account name',
            copyAuthLink: 'Copy authorization link',
            authMoonlet: 'Authorize Moonlet',
            congrats: 'Congrats! {{name}} is registered. Please authorize Moonlet to use it.',
            authProgress: 'Authorization in progress ...',
            notRegistered:
                'Account name not registered. If you want to use it, you need first to create it.',
            createHere: 'Create one here!',
            notSupported: 'Account name not supported yet. Try something else.'
        },
        LoadingModal: {
            txFailed: 'Transaction has failed!',
            GENERIC_ERROR:
                'Something went wrong while broadcasting your transaction. Please try again.',
            REVIEW_TRANSACTION: 'Review transaction on your hardware wallet',
            OPEN_APP: 'Please open {{app}} app on your Ledger',
            BROADCASTING: 'Broadcasting transaction',
            SIGNING: 'Signing transaction',
            CONNECTING_LEDGER: 'Connecting to your ledger. Make sure your device is unlocked',
            TR_UNDERPRICED: 'Transaction underpriced: gas price might be too low',
            NOT_ENOUGH_TOKENS: 'Insufficient funds for transaction',
            COSMOS_ERROR_12: 'Insufficient fee',
            COSMOS_ERROR_14: 'Insufficient funds for transaction',
            INSUFFICIENT_FUNDS_SOURCE_ACCOUNT: 'Insufficient funds in source account!',
            CONTRACT_TX_NORMAL_NOT_ALLOWED:
                "{{address}} is a smart contract that doesn't accept normal transactions",
            WAITING_TX_CONFIRM: 'Waiting for transaction confirmation from your mobile.',
            WAITING_TX_CONFIRM_CANCEL:
                'Waiting for transaction confirmation from your mobile. If you changed your mind please click on cancel below.'
        },
        SecurityChecks: {
            title: 'Security Warning!',
            ownRisk: 'Use Moonlet on your own risk!',
            ios: {
                emulator:
                    'You are running the application in iOS simulator, therefore we cannot guarantee the safety of the data.',
                jailBreak:
                    'Your device might be jail broken, therefore we cannot guarantee the safety of the data.',
                debugged:
                    "We've detected a debugger proccess connected to Moonlet, therefore we cannot guarantee the safety of the data.",
                hookDetected:
                    "We've detected the presence of reverse engeneering tools on your system, therefore we cannot guarantee the safety of the data."
            },
            android: {
                emulator:
                    'You are running the application in emulator, therefore we cannot guarantee the safety of the data.',
                jailBreak:
                    'Your device might be rooted, therefore we cannot guarantee the safety of the data.',
                debugged:
                    "We've detected a debugger proccess connected to Moonlet, therefore we cannot guarantee the safety of the data.",
                hookDetected:
                    "We've detected the presence of reverse engeneering tools on your system, therefore we cannot guarantee the safety of the data."
            }
        },
        ConnectExtension: {
            title: 'Connect extension',
            buttonScan: 'Scan QR code',
            body: 'Quickly connect extension and use Moonlet on your laptop or desktop computers',
            disconnect: 'Disconnect',
            disconnectInfo: 'Do you want to disconnect from this device?',
            currentlyActive: 'Currently active',
            qrCodeError: 'Invalid QR Code!',
            error: 'The connection has failed! Please try again!'
        },
        Notifications: {
            extensionTx: {
                title: 'Confirm transaction',
                body:
                    'Open Moonlet to confirm the following transaction: send {{formattedAmount}} to {{formattedAddress}}'
            },
            notificationsCenter: {
                emptyNotifTitle: 'No notifications available',
                emptyNotifSubtitle:
                    'Notifications will appear here once you start to make transactions'
            }
        },
        TransactionRequest: {
            title: 'Transaction request',
            walletName: 'Wallet name',
            accountName: 'Account name',
            errorMessage: 'Transaction request is not valid anymore.',
            errorMsgExtension: 'Transaction request is not valid anymore.',
            errorMsgToken:
                'This transaction request is not supported. Please go to  Dashboard > Menu > Manage account and add {{token}} token.',
            errorMsgGeneral:
                'This transaction request is not supported. Please create a ticket and let us know what you tried to do and what went wrong.',
            insufficientFunds:
                'You don’t have enough funds for this transaction request. Either select a different wallet/account or add more funds to this account.'
        },
        Validator: {
            selectValidator: 'Select\nvalidator(s)',
            confirmVote: 'Confirm\nvote(s)',
            confirmStake: 'Confirm\nstake(s)',
            totalStakes: 'Total Stakes',
            totalVotes: 'Total Votes',
            activatingVotes: 'Activating votes',
            totalDelegated: 'Total Delegated',
            myStake: 'My Stake',
            delegation: 'Delegation',
            unlockText1: 'You can only',
            unlockText2: 'unlock',
            unlockText3: 'the funds that are not voting.\n In order to unlock all funds, please',
            unlockText4: 'unvote',
            unlockText5: 'first.',
            unlockBottomText:
                'It takes {{duration}} in order to unlock the amount and will be automatically withdrawn then deposited into your available balance.',
            claimRewardBottomText:
                'The claimed reward you receive may be equal to or grater than what it displayed nou since rewards are accumulated each block.',
            noValidators: 'No validators available',
            stakeSection: 'This section will become available once you start to stake your tokens.'
        },
        Widget: {
            activateVotesTitle: 'Activate your votes now',
            waitTimeActivate: 'Wait {{timeFormat}} until next epoch',
            waitTimeWithdraw: 'Wait {{timeFormat}} to withdraw',
            claimText: 'Claim your rewards now',
            withdrawText: 'Withdraw your {{coin}} now'
        },
        AddNearAccount: {
            title: 'Create or recover\nan account name!',
            recoverAccount: 'Recover account name',
            createAccount: 'Create account name',
            noAccounts: 'No accounts name available',
            enableSectionWeb:
                'This section will be enabled once you create an account name from mobile app.'
        },
        QuickDelegateBanner: {
            mainText: {
                ZILLIQA: 'Stake now!',
                CELO: 'Vote now!',
                NEAR: 'Stake now!',
                COSMOS: 'Delegate now!'
            },
            availableAmount: 'you got {{amount}} available'
        },
        LedgerConnect: {
            searchFor: 'Searching for',
            NANO_X: 'Ledger Nano X',
            NANO_S: 'Ledger Nano S',
            onlyAndroid:
                'NOTE: Only Android devices are compatible with cables or adapters connectivity.',
            NANO_S_CONNECTED:
                'Please make sure your Ledger Nano S is unlocked with cable connected.',
            NANO_X_CONNECTED:
                'Please make sure your Ledger Nano X is unlocked with Bluetooth enabled.',
            somethingWentWrong: 'Oops, something went wrong...',
            verificationFailed: 'Verifcation failed',
            tryAgain:
                'Please try again. If the problem continues, check this troubleshooting guideline:',
            confirmFailed:
                'You need to confirm your {{blockchain}} address on your {{deviceModel}} for a successful pairing.\nPlease try again.',
            troubleshooting: 'Troubleshoot problems setting up Ledger.',
            confirmConnection: 'Confirming your connection',
            confirmBothDevices:
                'Confirm on both your phone and your {{deviceModel}} if the code matches.',
            openApp: 'Opening {{blockchain}} application',
            openAppOnDevice:
                'Please open your {{blockchain}} app on your {{deviceModel}} and wait a few seconds to have the connection established. Please be patient!',
            verifyAddressOnDevice:
                'Verify your {{blockchain}} address on your {{deviceModel}} and confirm it.',
            verifyAddress: 'Verifing your address',
            pairingSuccess: 'Pairing successful',
            readyToUse: 'Your {{deviceModel}} is ready\nto be used with Moonlet.',
            locationRequired: 'Location required',
            openSettings: 'Open location settings',
            locationRequiredSubtitle:
                'Location is disabled, therefore Moonlet is not able to scan for nearby Bluetooth devices. Enable Location from Settings and try again.',
            reviewTransaction: 'Review transaction',
            reviewTransactionDevice:
                'Review {{blockchain}} transaction on your {{deviceModel}} and confirm it.'
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
