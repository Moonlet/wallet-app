import reducer from '../reducer';
import * as actions from '../actions';
import { Blockchain } from '../../../core/blockchain/types';

describe('preferences reducer', () => {
    test('should set initial state', () => {
        expect(
            reducer(undefined as any, {
                type: '',
                data: ''
            })
        ).toMatchSnapshot();
    });

    test('should handle TOGGLE_TOUCH_ID', () => {
        expect(
            reducer(undefined as any, {
                type: actions.TOGGLE_TOUCH_ID,
                data: ''
            })
        ).toEqual({
            currency: 'USD',
            testNet: false,
            touchID: true,
            networks: {
                [Blockchain.ETHEREUM]: {
                    testNet: 4,
                    mainNet: 1
                },
                [Blockchain.ZILLIQA]: {
                    testNet: 333,
                    mainNet: 1
                },
                [Blockchain.NEAR]: {
                    testNet: 'testnet',
                    mainNet: 'testnet' // not released yet
                }
            },
            blockchains: {
                [Blockchain.ETHEREUM]: {
                    order: 1,
                    active: true
                },
                [Blockchain.ZILLIQA]: {
                    order: 0,
                    active: true
                },
                [Blockchain.NEAR]: {
                    order: 2,
                    active: true
                }
            }
        });
    });
});
