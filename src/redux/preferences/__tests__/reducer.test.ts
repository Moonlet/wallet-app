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

    test('should handle TOGGLE_PIN_LOGIN', () => {
        expect(
            reducer(undefined as any, {
                type: actions.TOGGLE_PIN_LOGIN,
                data: ''
            })
        ).toEqual({
            currency: 'USD',
            testNet: false,
            pinLogin: false,
            touchID: false,
            networks: {
                [Blockchain.ETHEREUM]: {
                    testNet: 4,
                    mainNet: 1
                },
                [Blockchain.ZILLIQA]: {
                    testNet: 333,
                    mainNet: 1
                }
            },
            blockchains: {
                [Blockchain.ETHEREUM]: {
                    order: 0,
                    active: true
                },
                [Blockchain.ZILLIQA]: {
                    order: 1,
                    active: true
                }
            }
        });
    });
});
