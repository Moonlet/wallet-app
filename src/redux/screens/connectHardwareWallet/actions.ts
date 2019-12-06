// actions consts
export const VERIFY_ADDRESS_ON_DEVICE = 'VERIFY_ADDRESS_ON_DEVICE';
export const HARDWARE_WALLET_CREATED = 'HARDWARE_WALLET_CREATED';

// actions creators
export const verifyAddressOnDevice = (verify: boolean) => {
    return {
        type: VERIFY_ADDRESS_ON_DEVICE,
        data: verify
    };
};

export const hardwareWalletCreated = () => {
    return {
        type: HARDWARE_WALLET_CREATED
    };
};
