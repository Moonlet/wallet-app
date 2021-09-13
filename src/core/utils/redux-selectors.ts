import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { pickInsensitiveKey } from '../../core/utils/pick';
import { ITokenConfigState, ITokensConfigState } from '../../redux/tokens/state';

export const getTokenConfig = (
    tokens: ITokensConfigState,
    blockchainTokens: {
        [symbol: string]: ITokenConfigState;
    },
    chainId: ChainIdType,
    blockchain: Blockchain,
    symbol: string
): ITokenConfigState => {
    if (tokens[blockchain] && tokens[blockchain][chainId]) {
        const token = pickInsensitiveKey(tokens[blockchain][chainId], symbol);
        if (token) return token;
    }

    const blockchainToken = pickInsensitiveKey(blockchainTokens, symbol);
    if (blockchainToken) {
        return blockchainToken;
    }
};
