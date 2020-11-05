import { PosBasicActionType } from '../../../../../core/blockchain/types/token';
import { TransactionStatus } from '../../../../../core/wallet/types';
import { IReduxState } from '../../../../../redux/state';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule, IScreenModuleWrapperData } from '../../../types';

export const updateClaimPending = (state: IReduxState, module: IScreenModule): string => {
    const wrapper = module.data as IScreenModuleWrapperData;

    const wallet = getSelectedWallet(state);
    const selectedAccount = getSelectedAccount(state);

    for (const tx of Object.values(wallet?.transactions || [])) {
        if (
            tx?.data?.params &&
            tx?.data?.params[0] === wrapper?.data?.DEFAULT?.details?.validatorId &&
            tx?.broadcastedOnBlock > wrapper?.data?.DEFAULT?.details?.cycleStart &&
            tx?.address === selectedAccount.address &&
            (tx?.additionalInfo?.posAction === PosBasicActionType.CLAIM_REWARD ||
                tx?.additionalInfo?.posAction === PosBasicActionType.CLAIM_REWARD_NO_INPUT)
        ) {
            switch (tx.status) {
                case TransactionStatus.PENDING:
                    return 'PENDING';
                case TransactionStatus.SUCCESS:
                    return 'CLAIMED';
                default:
                    return 'DEFAULT';
            }
        }
    }

    return 'DEFAULT';
};