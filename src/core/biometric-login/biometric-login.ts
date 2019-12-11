import TouchID, { AuthenticateConfig } from 'react-native-touch-id';

/**
 * The supported biometry type
 */
type BiometryType = 'FaceID' | 'TouchID';

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
    authenticate(reason?: string, config?: AuthenticateConfig) {
        return TouchID.authenticate(reason, config);
    },
    isSupported(config?: IsSupportedConfig): Promise<BiometryType> {
        return TouchID.isSupported(config);
    }
};
