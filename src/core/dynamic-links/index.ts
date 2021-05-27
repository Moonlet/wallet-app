import dynamicLinks from '@react-native-firebase/dynamic-links';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { IReduxState } from '../../redux/state';
import { NavigationService } from '../../navigation/navigation-service';
import { getChainId } from '../../redux/preferences/selectors';
import { setSelectedBlockchain } from '../../redux/wallets/actions';
import { Blockchain } from '../blockchain/types';
import { IValidator } from '../blockchain/types/stats';
import { getNrPendingTransactions, getSelectedAccount } from '../../redux/wallets/selectors';
import { ITokenState } from '../../redux/wallets/state';
import { store } from '../../redux/config';

export class DynamicLinksService {
    private onLinkListener = null;
    private state: IReduxState = null;

    private handlers = {
        '/:blockchain/:token/validator/:validatorAddress': params => {
            this.navigateValidatorAddress(params);
        },
        '/:blockchain/:token/stake/:validatorAddress': params => {
            this.stakeValidatorAddress(params);
        },
        '/:blockchain/stake': params => {
            this.blockchainStake(params);
        },
        '/stake': params => {
            // TODO: implement later on
            // console.log('stakeDefault', params);
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

            // @ts-ignore
            const reduxValidators = this.state.validators;

            const validators =
                reduxValidators &&
                reduxValidators[blockchain] &&
                reduxValidators[blockchain][chainId as string];

            let validator: IValidator;

            if (validators && Array.isArray(validators) && validators.length > 0) {
                validator = validators.find(
                    v => v.id.toLowerCase() === validatorAddress.toLowerCase()
                );
            }

            const selectedAccount = getSelectedAccount(this.state);

            const token: ITokenState = selectedAccount.tokens[chainId][tokenSymbol];

            if (validator) {
                const hasPendingTransactions = getNrPendingTransactions(this.state);

                NavigationService.navigate('Validator', {
                    blockchain,
                    validator,
                    accountIndex: selectedAccount.index,
                    token,
                    canPerformAction: !hasPendingTransactions
                });
            }
        }
    }

    private stakeValidatorAddress(params: any) {
        const blockchain = String(params?.blockchain)?.toUpperCase() as Blockchain;
        const validatorAddress = params?.validatorAddress;
        // const tokenSymbol = String(params?.token)?.toUpperCase();

        if (blockchain && validatorAddress) {
            // make sure `blockchain` is selected
            store.dispatch(setSelectedBlockchain(blockchain));

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
        }
    }

    private blockchainStake(params: any) {
        const blockchain = String(params?.blockchain)?.toUpperCase() as Blockchain;

        if (blockchain) {
            // make sure `blockchain` is selected
            store.dispatch(setSelectedBlockchain(blockchain));

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
        }
    }

    public async configure(state: IReduxState) {
        this.state = state;

        const dl = dynamicLinks();

        this.onLinkListener = dl.onLink(link => {
            this.handleDynamicLink(link);
        });

        // application is in a background state or has fully quit
        dynamicLinks()
            .getInitialLink()
            .then(link => {
                this.handleDynamicLink(link);
            });
    }

    // app is in the foreground state
    public async handleDynamicLink(link) {
        if (link?.url) {
            this.processUrl(link.url);
        } else {
            SentryCaptureException(new Error(JSON.stringify(`Invalid link url, link:${link}`)));
        }
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

        let path = u?.pathname;

        if (path && String(path).startsWith('/links')) path = path.replace('/links', '');

        const searchParams = new URLSearchParams(url);

        return this.processPath(path, pathHandlers, this.paramsToObject(searchParams.entries()));
    }
}

export const DynamicLinks = new DynamicLinksService();
