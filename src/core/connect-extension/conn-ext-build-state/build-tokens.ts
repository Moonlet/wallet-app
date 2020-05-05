import * as IExtStorage from '../types';
import { ChainIdType, Blockchain } from '../../blockchain/types';
import { ITokensConfigState, ITokenConfigState } from '../../../redux/tokens/state';
import CONFIG from '../../../config';
import { getBlockchain } from '../../blockchain/blockchain-factory';
import { TokenScreenComponentType, GENERIC_TOKEN_ICON } from '../../blockchain/types/token';

const convertTokenToState = (
    tk: IExtStorage.IStorageToken,
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

const fetchToken = async (
    blockchain: Blockchain,
    chainId: ChainIdType,
    tk: IExtStorage.IStorageToken
): Promise<ITokenConfigState> => {
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
        return convertTokenToState(tk, staticToken, blockchainToken);
    }

    return undefined;
};

export const buildTokens = async (
    trimmedTokens: IExtStorage.IStorageTokens
): Promise<ITokensConfigState> => {
    const finalTokens: ITokensConfigState = {};

    await Promise.all(
        Object.entries(trimmedTokens).map(async objBlockchain => {
            // Blockchain level
            const blockchain: Blockchain = objBlockchain[0] as Blockchain;

            return Promise.all(
                Object.entries(objBlockchain[1]).map(async objChainId => {
                    // Chain Id level
                    const chainId: ChainIdType = objChainId[0];

                    return Promise.all(
                        Object.entries(objChainId[1]).map(async obj => {
                            // Symbol level
                            const trimmedToken: IExtStorage.IStorageToken = obj[1] as any;

                            const buildToken = await fetchToken(blockchain, chainId, trimmedToken);

                            if (buildToken) {
                                Object.assign(finalTokens, {
                                    ...finalTokens,
                                    [blockchain]: {
                                        ...(finalTokens && finalTokens[blockchain]),
                                        [chainId]: {
                                            ...(finalTokens[blockchain] &&
                                                finalTokens[blockchain][chainId]),
                                            [buildToken.symbol]: buildToken
                                        }
                                    }
                                });
                            }
                        })
                    );
                })
            );
        })
    );

    return finalTokens;
};
