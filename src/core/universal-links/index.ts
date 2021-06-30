import { Linking } from 'react-native';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { IReduxState } from '../../redux/state';
import { NavigationService } from '../../navigation/navigation-service';
import { getChainId } from '../../redux/preferences/selectors';
import { setSelectedBlockchain } from '../../redux/wallets/actions';
import { Blockchain } from '../blockchain/types';
import { getNrPendingTransactions, getSelectedAccount } from '../../redux/wallets/selectors';
import { ITokenState } from '../../redux/wallets/state';
import { store } from '../../redux/config';

export class UniversalLinksService {
    private onLinkListener = null;
    private state: IReduxState = null;

    private handlers = {
        '/stake': params => {
            // TODO: implement later on
        },
        '/:blockchain/stake': params => {
            this.blockchainStake(params);
        },
        '/:blockchain/:token/validator/:validatorAddress': params => {
            this.navigateValidatorAddress(params);
        },
        '/:blockchain/:token/stake': params => {
            this.blockchainStake(params);
        },
        '/:blockchain/:token/stake/:validatorAddress': params => {
            this.stakeValidatorAddress(params);
        }
    };

    private navigateValidatorAddress(params: any) {
        const blockchain = String(params?.blockchain)?.toUpperCase() as Blockchain;
        const validatorAddress = params?.validatorAddress;
        const tokenSymbol = String(params?.token)?.toUpperCase();

        if (blockchain && validatorAddress && tokenSymbol) {
            // make sure `blockchain` is selected
            store.dispatch(setSelectedBlockchain(blockchain));

            const chainId = getChainId(this.state, blockchain);

            const selectedAccount = getSelectedAccount(this.state);

            if (!selectedAccount) {
                SentryCaptureException(
                    new Error(
                        `Dynamic Links - no selected account, no wallet, blockchain: ${blockchain}, tokenSymbol: ${tokenSymbol}, validatorAddress: ${validatorAddress}`
                    )
                );
                return;
            }

            const token: ITokenState = selectedAccount.tokens[chainId][tokenSymbol];

            NavigationService.popToTop();
            NavigationService.navigate('Validator', {
                blockchain,
                undefined, // validator
                accountIndex: selectedAccount.index,
                token,
                canPerformAction: !getNrPendingTransactions(this.state), // hasPendingTransactions
                options: {
                    validatorAddress,
                    tokenSymbol
                }
            });
        } else {
            SentryCaptureException(
                new Error(`Dynamic Links - navigateValidatorAddress, invalid params: ${params}`)
            );
        }
    }

    private stakeValidatorAddress(params: any) {
        const blockchain = String(params?.blockchain)?.toUpperCase() as Blockchain;
        const validatorAddress = params?.validatorAddress;

        if (blockchain && validatorAddress) {
            // make sure `blockchain` is selected
            store.dispatch(setSelectedBlockchain(blockchain));

            NavigationService.popToTop();
            NavigationService.navigate('SmartScreen', {
                context: {
                    screen: 'StakeNow',
                    step: 'SelectStakeAccount',
                    key: 'select-stake-account',
                    params: {
                        validatorId: validatorAddress
                    }
                },
                navigationOptions: {
                    title: 'Stake now'
                },
                newFlow: true
            });
        } else {
            SentryCaptureException(
                new Error(`Dynamic Links - stakeValidatorAddress, invalid params: ${params}`)
            );
        }
    }

    private blockchainStake(params: any) {
        const blockchain = String(params?.blockchain)?.toUpperCase() as Blockchain;

        if (blockchain) {
            // make sure `blockchain` is selected
            store.dispatch(setSelectedBlockchain(blockchain));

            NavigationService.popToTop();
            NavigationService.navigate('SmartScreen', {
                context: {
                    screen: 'StakeNow',
                    step: 'StakeSelectValidator',
                    key: 'stake-now-select-validator'
                },
                navigationOptions: {
                    title: 'Stake now'
                },
                newFlow: true
            });
        } else {
            SentryCaptureException(
                new Error(`Dynamic Links - blockchainStake, invalid params: ${params}`)
            );
        }
    }

    public async configure(state: IReduxState) {
        this.state = state;

        this.onLinkListener = Linking.addEventListener('url', ({ url }) => {
            this.handleDynamicLink(url);
        });

        Linking.getInitialURL().then(url => {
            this.handleDynamicLink(url);
        });
    }

    public async handleDynamicLink(url: string) {
        url &&
            this.processUrl(url, this.handlers, {
                protocol: ['https:'],
                host: [
                    'wallet.moonlet.app',
                    'wallet.moonlet.dev',

                    'moonlet.io',
                    'moonlet.xyz',
                    'moonletwallet.com',
                    'moonlet.app',
                    'moonlet.link',

                    'fire.moonlet.dev'
                ]
            });
    }

    public removeListeners() {
        typeof this.onLinkListener === 'function' && this.onLinkListener();
    }

    private pathPatternToRegexp(pathPattern: string) {
        let exp = '^';

        const pathParts = pathPattern.split('/').filter(Boolean);
        const capturingGroups = [];
        for (const part of pathParts) {
            exp += '\\/';
            if (part.indexOf(':') === 0) {
                exp += '([^\\/]*)';
                capturingGroups.push(part.replace(/^:/, ''));
            } else {
                exp += part;
            }
        }

        exp += '$';
        return {
            regexp: new RegExp(exp),
            capturingGroups
        };
    }

    private parsePath(path: string, pathPatternString: string) {
        const pathPattern = this.pathPatternToRegexp(pathPatternString);
        const match = path.match(pathPattern.regexp);

        if (match) {
            const params = {};
            for (let i = 0; i < pathPattern.capturingGroups.length; i++) {
                params[pathPattern.capturingGroups[i]] = match[i + 1];
            }
            return params;
        }

        return null;
    }

    private processPath(path: string, handlers: any, urlParams = {}) {
        const pathsPatterns = Object.keys(handlers);
        for (const pathPattern of pathsPatterns) {
            if (typeof handlers[pathPattern] === 'function') {
                const params = this.parsePath(path, pathPattern);
                if (params) {
                    return handlers[pathPattern]({
                        ...urlParams,
                        ...params
                    });
                }
            }
        }
    }

    private paramsToObject(entries: any) {
        const result = {};
        for (const [key, value] of entries) {
            // each 'entry' is a [key, value] tupple
            result[key] = value;
        }
        return result;
    }

    private processUrl(url: string, pathHandlers: any = this.handlers, whitelist = {}) {
        const u = new URL(url);

        for (const key of Object.keys(whitelist)) {
            if (u && typeof u[key] === 'string' && whitelist[key].indexOf(u[key]) < 0) {
                SentryCaptureException(
                    new Error(
                        JSON.stringify(
                            `whitelist not matched ${key}=${u[key]} not in whitelist: ${
                                typeof whitelist[key] === 'string'
                                    ? whitelist[key]
                                    : whitelist[key].join(', ')
                            }`
                        )
                    )
                );
                return null;
            }
        }

        const path = u?.pathname;

        const searchParams = new URLSearchParams(url);

        return this.processPath(path, pathHandlers, this.paramsToObject(searchParams.entries()));
    }
}

export const UniversalLinks = new UniversalLinksService();
