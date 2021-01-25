const bs58 = require('bs58');
const nacl = require('tweetnacl');
// const solana = require('@solana/web3.js');
const assert = require('assert');

const INS_GET_PUBKEY = 0x05;
const INS_GET_APP_CONFIGURATION = 0x04;
const INS_SIGN_MESSAGE = 0x06;

const P1_NON_CONFIRM = 0x00;
const P1_CONFIRM = 0x01;

const P2_EXTEND = 0x01;
const P2_MORE = 0x02;

const MAX_PAYLOAD = 255;

const LEDGER_CLA = 0xe0;

const STATUS_OK = 0x9000;
const BIP32_HARDENED_BIT = (1 << 31) >>> 0;

class Solana {
    constructor(transport) {
        this.transport = transport;
    }
    /*
     * Helper for chunked send of large payloads
     */
    async solana_send(transport, instruction, p1, payload) {
        // console.log('solana send', instruction, p1, payload);
        var p2 = 0;
        var payload_offset = 0;

        if (payload.length > MAX_PAYLOAD) {
            while (payload.length - payload_offset > MAX_PAYLOAD) {
                const buf = payload.slice(payload_offset, payload_offset + MAX_PAYLOAD);
                payload_offset += MAX_PAYLOAD;
                const reply = await transport.send(LEDGER_CLA, instruction, p1, p2 | P2_MORE, buf);
                if (reply.length != 2) {
                    throw new TransportError(
                        'solana_send: Received unexpected reply payload',
                        'UnexpectedReplyPayload'
                    );
                }
                p2 |= P2_EXTEND;
            }
        }

        const buf = payload.slice(payload_offset);
        const reply = await transport.send(LEDGER_CLA, instruction, p1, p2, buf);

        return reply.slice(0, reply.length - 2);
    }

    _harden(n) {
        return (n | BIP32_HARDENED_BIT) >>> 0;
    }

    solana_derivation_path(account, change) {
        var length;
        if (typeof account === 'number') {
            if (typeof change === 'number') {
                length = 4;
            } else {
                length = 3;
            }
        } else {
            length = 2;
        }

        var derivation_path = Buffer.alloc(1 + length * 4);
        var offset = 0;
        offset = derivation_path.writeUInt8(length, offset);
        offset = derivation_path.writeUInt32BE(this._harden(44), offset); // Using BIP44
        offset = derivation_path.writeUInt32BE(this._harden(501), offset); // Solana's BIP44 path

        if (length > 2) {
            offset = derivation_path.writeUInt32BE(this._harden(account), offset);
            if (length == 4) {
                offset = derivation_path.writeUInt32BE(this._harden(change), offset);
            }
        }

        return derivation_path;
    }

    solana_ledger_get_pubkey() {
        return this.solana_send(
            this.transport,
            INS_GET_PUBKEY,
            P1_CONFIRM,
            this.solana_derivation_path()
        );
    }

    async solana_ledger_get_version() {
        // console.log('solana_ledger_get_version');
        return this.solana_send(
            this.transport,
            INS_GET_APP_CONFIGURATION,
            P1_NON_CONFIRM,
            Buffer.from('')
        ).then(info => {
            return `${info[2]}.${info[3]}.${info[4]}`;
        });
    }

    solana_ledger_sign_transaction(transaction) {
        const msg_bytes = transaction.serializeMessage();

        // XXX: Ledger app only supports a single derivation_path per call ATM
        var num_paths = Buffer.alloc(1);
        num_paths.writeUInt8(1);

        const payload = Buffer.concat([num_paths, this.solana_derivation_path(), msg_bytes]);

        return this.solana_send(this.transport, INS_SIGN_MESSAGE, P1_CONFIRM, payload);
    }

    // (async () => {
    //     var transport = await Transport.create();

    //     const from_derivation_path = solana_derivation_path();
    //     const from_pubkey_bytes = await solana_ledger_get_pubkey(transport, from_derivation_path);
    //     const from_pubkey_string = bs58.encode(from_pubkey_bytes);
    //     console.log('---', from_pubkey_string);

    //     const to_derivation_path = solana_derivation_path(1);
    //     const to_pubkey_bytes = await solana_ledger_get_pubkey(transport, to_derivation_path);
    //     const to_pubkey_string = bs58.encode(to_pubkey_bytes);
    //     console.log('---', to_pubkey_string);

    //     const from_pubkey = new solana.PublicKey(from_pubkey_string);
    //     const to_pubkey = new solana.PublicKey(to_pubkey_string);
    //     var tx = solana.SystemProgram.transfer({
    //         fromPubkey: from_pubkey,
    //         toPubkey: to_pubkey,
    //         lamports: 42
    //     });

    //     // XXX: Fake blockhash so this example doesn't need a
    //     // network connection. It should be queried from the
    //     // cluster in normal use.
    //     tx.recentBlockhash = bs58.encode(
    //         Buffer.from([
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3,
    //             3
    //         ])
    //     );

    // const sig_bytes = await solana_ledger_sign_transaction(transport, from_derivation_path, tx);

    // const sig_string = bs58.encode(sig_bytes);
    // console.log('--- len:', sig_bytes.length, 'sig:', sig_string);

    //     tx.addSignature(from_pubkey, sig_bytes);
    //     console.log('--- verifies:', tx.verifySignatures());
    // })().catch(e => console.log(e));
}

exports.default = Solana;
