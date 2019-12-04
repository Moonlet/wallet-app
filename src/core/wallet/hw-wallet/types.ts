import { Blockchain } from '../../blockchain/types';

export enum HWVendor {
    LEDGER = 'LEDGER',
    TREZOR = 'TREZOR'
}

export enum HWModel {
    NANO_S = 'NANO_S',
    NANO_X = 'NANO_X'
}

export enum HWConnection {
    USB = 'USB',
    U2F = 'U2F',
    BLE = 'BLE'
}

export type ConnectionType = Array<'USB' | 'U2F' | 'BLE'>;
