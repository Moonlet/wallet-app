const bs58 = require('bs58');

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
        let msg_bytes;
        try {
            msg_bytes = transaction.serializeMessage();
            // XXX: Ledger app only supports a single derivation_path per call ATM
            var num_paths = Buffer.alloc(1);

            num_paths.writeUInt8(1);

            const payload = Buffer.concat([num_paths, this.solana_derivation_path(), msg_bytes]);

            return this.solana_send(this.transport, INS_SIGN_MESSAGE, P1_CONFIRM, payload);
        } catch (e) {
            return;
        }
    }
}

exports.default = Solana;
