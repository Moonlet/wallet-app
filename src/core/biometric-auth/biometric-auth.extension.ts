/**
 * The supported biometry type
 */
export type BiometryType = 'FaceID' | 'TouchID';

/**
 * Base config to pass to `TouchID.isSupported` and `TouchID.authenticate`
 */
interface IsSupportedConfig {
    /**
     * Return unified error messages
     */
    unifiedErrors?: boolean;
}

export const biometricAuth = {
    isSupported(config?: IsSupportedConfig): Promise<BiometryType> {
        return Promise.reject('NOT_SUPPORTED');
    }
};
