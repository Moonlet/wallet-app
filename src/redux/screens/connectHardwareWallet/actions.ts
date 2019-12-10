// actions consts
export const VERIFY_ADDRESS_ON_DEVICE = 'VERIFY_ADDRESS_ON_DEVICE';

// actions creators
export const verifyAddressOnDevice = (verify: boolean) => {
    return {
        type: VERIFY_ADDRESS_ON_DEVICE,
        data: verify
    };
};
