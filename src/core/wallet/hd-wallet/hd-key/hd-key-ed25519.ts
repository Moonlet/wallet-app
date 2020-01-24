const HARDENED_OFFSET = 0x80000000;
const ED25519_CURVE = 'ed25519 seed';

// import createHmac from 'create-hmac'
import { createHmac } from 'crypto';

interface IKeys {
    key: Buffer;
    chainCode: Buffer;
}

const replaceDerive = (val: string): string => val.replace("'", '');

const pathRegex = new RegExp("^m(\\/[0-9]+')+$");

const CKDPriv = ({ key, chainCode }: IKeys, index: number): IKeys => {
    const indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32BE(index, 0);

    const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);

    const I = createHmac('sha512', chainCode)
        .update(data)
        .digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR
    };
};

const isValidPath = (path: string): boolean => {
    if (!pathRegex.test(path)) {
        return false;
    }
    return !path
        .split('/')
        .slice(1)
        .map(replaceDerive)
        .some(isNaN as any /* ts T_T*/);
};

export const getMasterKeyFromSeed = (seed: string): IKeys => {
    const hmac = createHmac('sha512', ED25519_CURVE);
    const I = hmac.update(Buffer.from(seed, 'hex')).digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR
    };
};

export class HDKeyEd25519 {
    public static fromMasterSeed(seed: Buffer): HDKeyEd25519 {
        const masterKey = getMasterKeyFromSeed(seed.toString('hex'));
        return new HDKeyEd25519(masterKey.key, masterKey.chainCode);
    }
    constructor(public key: Buffer, public chainCode: Buffer) {}

    public derive(path): HDKeyEd25519 {
        if (!isValidPath(path)) {
            throw new Error('Invalid derivation path');
        }

        const segments = path
            .split('/')
            .slice(1)
            .map(replaceDerive)
            .map(el => parseInt(el, 10));

        const keys = segments.reduce(
            (parentKeys, segment) => CKDPriv(parentKeys, segment + HARDENED_OFFSET),
            { key: this.key, chainCode: this.chainCode }
        );
        return new HDKeyEd25519(keys.key, keys.chainCode);
    }
}
