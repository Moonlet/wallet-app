import BigNumber from 'bignumber.js';
import BN from 'bn.js';

export const NEAR_DEFAULT_FUNC_CALL_GAS = new BN('100000000000000');

export const CREATE_ACCOUNT_NEAR_FEES = new BN('1000000000000000000000000');
export const CREATE_ACCOUNT_NEAR_DEPOSIT = new BN('100000000000000000000000');

export const NEAR_CREATE_ACCOUNT_MIN_BALANCE = new BN(
    new BigNumber(CREATE_ACCOUNT_NEAR_FEES.toString())
        .plus(new BigNumber(CREATE_ACCOUNT_NEAR_DEPOSIT.toString()))
        .toFixed()
);
