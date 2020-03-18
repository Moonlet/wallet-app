import { IAppConfig } from './config-interface';
import { Platform } from 'react-native';

export const CONFIG: IAppConfig = {
    supportUrl: 'https://moonlet.xyz/links/support',
    example: Platform.select({
        default: 'default release',
        web: 'web release'
    }),
    env: process.env.MOONLET_SOME_KEY
};

export default CONFIG;
