import { Client as EthereumClient } from '../ethereum/client';
import { Erc20Client } from './tokens/erc20-client';
import { ChainIdType, TransactionMessageText } from '../types';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';
import { networks } from './networks';
import { HttpClient } from '../../utils/http-client';
import { NameService } from './name-service';

export class Client extends EthereumClient {
    constructor(chainId: ChainIdType) {
        super(chainId);
        this.tokens[TokenType.ERC20] = new Erc20Client(this);
        this.nameService = new NameService();
        this.utils = new ClientUtils(this);

        let url = networks[0].url;
        const network = networks.filter(n => n.chainId === chainId)[0];
        if (network) {
            url = network.url;
        }
        this.http = new HttpClient(url);
    }

    public sendTransaction(transaction): Promise<string> {
        return this.http.jsonRpc('eth_sendRawTransaction', [transaction]).then(res => {
            if (res.result) {
                return res.result;
            }

            const errorMessage: string = res.error.message;
            if (errorMessage.includes('transaction underpriced')) {
                return Promise.reject(TransactionMessageText.TR_UNDERPRICED);
            }
            if (errorMessage.includes('insufficient funds for gas')) {
                return Promise.reject(TransactionMessageText.NOT_ENOUGH_TOKENS);
            }
        });
    }
}
