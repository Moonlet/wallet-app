/**
 * Add REDC Token to all users and Bibek P - 12 March 2021 
 */

 import { accountToken } from '../../tokens/static-selectors';
 import { Blockchain } from '../../../core/blockchain/types';
 
 import { IWalletState, IAccountState } from '../../wallets/state';
 import { REDC_MAINNET } from '../../../core/blockchain/zilliqa/tokens/redc';
 
 export default (state: any) => {
     const zilChainIdMain = '1';
 
     if (
         state.tokens[Blockchain.ZILLIQA] &&
         state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
         state.tokens[Blockchain.ZILLIQA][zilChainIdMain][REDC_MAINNET.symbol]
     ) {
         // Update REDC contract address
         state.tokens[Blockchain.ZILLIQA][zilChainIdMain][REDC_MAINNET.symbol].contractAddress =
             REDC_MAINNET.contractAddress;
     } else {
         // Add REDC Token
         state.tokens = {
             ...state.tokens,
             [Blockchain.ZILLIQA]: {
                 ...(state.tokens && state.tokens[Blockchain.ZILLIQA]),
                 [zilChainIdMain]: {
                     ...(state.tokens &&
                         state.tokens[Blockchain.ZILLIQA] &&
                         state.tokens[Blockchain.ZILLIQA][zilChainIdMain]),
                     [REDC_MAINNET.symbol]: REDC_MAINNET
                 }
             }
         };
     }
     // Add tokens on accounts
     Object.values(state.wallets).map((wallet: IWalletState) => {
         wallet.accounts.map((account: IAccountState) => {
             // Zilliqa
             if (account.blockchain === Blockchain.ZILLIQA) {
                 if (
                     account.tokens[zilChainIdMain] &&
                     account.tokens[zilChainIdMain][REDC_MAINNET.symbol]
                 ) {
                     // REDC has been already added
                 } else {
                     // Add REDC Token
                     account.tokens[zilChainIdMain][REDC_MAINNET.symbol] = accountToken(
                         REDC_MAINNET.symbol,
                         999
                     );
                 }
             }
         });
     });
 
     return {
         ...state
     };
 };
 