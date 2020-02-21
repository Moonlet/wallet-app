import { TransactionStatus } from '../../wallet/types';

export const getEthStatusByCode = (status): TransactionStatus => {
    switch (parseInt(status, 16)) {
        case 0:
            return TransactionStatus.FAILED;
        case 1:
            return TransactionStatus.SUCCESS;
        case 2:
            return TransactionStatus.PENDING;
        default:
            return TransactionStatus.FAILED;
    }
};
