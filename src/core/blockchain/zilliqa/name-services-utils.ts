import { createHash } from 'crypto';

const sha256Function = (
    message,
    {
        hexPrefix = true,
        inputEnc,
        outputEnc = 'hex'
    }: { hexPrefix?: boolean; inputEnc?: 'hex'; outputEnc?: 'hex' } = {}
): string => {
    const created = createHash('sha256');
    const result =
        (hexPrefix ? '0x' : '') + created.update(Buffer.from(message, inputEnc)).digest(outputEnc);
    return result;
};

const childhash = (
    parent: string,
    label: string,
    options: { prefix: boolean } = { prefix: true }
): string => {
    parent = parent.replace(/^0x/, '');
    return sha256Function(parent + sha256Function(label, { hexPrefix: false }), {
        hexPrefix: options.prefix,
        inputEnc: 'hex'
    });
};

export const namehash = (domain: string): string => {
    const parent = '0000000000000000000000000000000000000000000000000000000000000000';
    const assembledHash = [parent]
        .concat(
            domain
                .split('.')
                .reverse()
                .filter(label => label)
        )
        .reduce((parr, label): string => childhash(parr, label, { prefix: false }));
    return '0x' + assembledHash;
};
