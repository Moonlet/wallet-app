import * as IExtStorage from '../types';
import { ChainIdType, Blockchain } from '../../blockchain/types';
import { ITokensConfigState, ITokenConfigState } from '../../../redux/tokens/state';
import CONFIG from '../../../config';
import { getBlockchain } from '../../blockchain/blockchain-factory';
import {
    TokenScreenComponentType,
    GENERIC_TOKEN_ICON,
    TokenType
} from '../../blockchain/types/token';
import { addTokenForBlockchain } from '../../../redux/tokens/actions';
import { store } from '../../../redux/config';

const convertTokenToState = (
    tk: { type: TokenType; symbol: string; contractAddress: string },
    staticToken: any,
    blockchainToken: any
): ITokenConfigState => {
    if (blockchainToken) {
        if (blockchainToken.name === '') blockchainToken = undefined;
    }
    const decimals = blockchainToken ? blockchainToken.decimals : staticToken.decimals;

    return {
        name: blockchainToken ? blockchainToken.name : staticToken.name,
        symbol: tk.symbol,
        icon: staticToken ? { uri: staticToken.logo } : GENERIC_TOKEN_ICON,
        type: tk.type,
        contractAddress: tk.contractAddress,
        decimals,
        ui: {
            decimals,
            tokenScreenComponent: TokenScreenComponentType.DEFAULT
        }
    };
};

export const buildTokens = async (
    trimmedTokens: IExtStorage.IStorageTokens
): Promise<ITokensConfigState> => {
    const finalTokens: ITokensConfigState = {};

    await Promise.all(
        Object.keys(trimmedTokens).map((blockchain: Blockchain) => {
            Object.keys(trimmedTokens[blockchain]).map((chainId: ChainIdType) => {
                Object.values(trimmedTokens[blockchain][chainId]).map(
                    async (tk: { type: TokenType; symbol: string; contractAddress: string }) => {
                        let token: ITokenConfigState;

                        let staticToken;
                        let blockchainToken;

                        try {
                            const fetchResponse = await fetch(
                                CONFIG.tokensUrl +
                                    `${blockchain.toLocaleLowerCase()}/${tk.symbol.toLocaleLowerCase()}.json`
                            );

                            if (fetchResponse.status === 200) {
                                staticToken = await fetchResponse.json();
                                blockchainToken = await getBlockchain(blockchain)
                                    .getClient(chainId)
                                    .tokens[tk.type].getTokenInfo(tk.contractAddress);
                            }
                        } catch {
                            //
                        }

                        if (staticToken || blockchainToken) {
                            token = convertTokenToState(tk, staticToken, blockchainToken);

                            Object.assign(finalTokens, {
                                ...finalTokens,
                                [blockchain]: {
                                    ...(finalTokens && finalTokens[blockchain]),
                                    [chainId]: {
                                        ...(finalTokens[blockchain] &&
                                            finalTokens[blockchain][chainId]),
                                        [token.symbol]: token
                                    }
                                }
                            });

                            store.dispatch(
                                addTokenForBlockchain(blockchain, token, chainId) as any
                            );
                        }
                    }
                );
            });
        })
    );

    return finalTokens;
};
