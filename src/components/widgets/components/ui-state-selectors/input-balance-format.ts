import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { IReduxState } from '../../../../redux/state';
import { getSelectedBlockchain } from '../../../../redux/wallets/selectors';
import { IScreenModule } from '../../types';

export const getInputBalanceFormat = (
    state: IReduxState,
    module: IScreenModule,
    options: { flowId: string; screenKey: string }
) => {
    const blockchainInstance = getBlockchain(getSelectedBlockchain(state));

    let balance = new BigNumber(0);

    if (
        options?.screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[options?.screenKey]?.data?.amount
    ) {
        balance = new BigNumber(state.ui.screens.inputData[options.screenKey].data.amount);
    }

    return `${balance} ${blockchainInstance.config.coin}`;
};
