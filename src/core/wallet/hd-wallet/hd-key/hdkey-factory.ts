import { DerivationType } from '../../../blockchain/types';
import HDKey from 'hdkey';
import { HDKeyEd25519 } from './hd-key-ed25519';

export class HDKeyFactory {
    public static get(derivationType: DerivationType, seed: Buffer) {
        switch (derivationType) {
            case DerivationType.HD_KEY:
                return HDKey.fromMasterSeed(seed);
            case DerivationType.HD_KEY_ED25519:
                return HDKeyEd25519.fromMasterSeed(seed);
        }
    }
}
