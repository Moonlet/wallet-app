import React from 'react';
import { shallow } from 'enzyme';
import { DummyScreen, menuIcon, removeAnimation } from '../utils';

export default describe('NavigationUtils', () => {
    describe('DummyScreen', () => {
        test('renders corectly', () => {
            expect(shallow(<DummyScreen />).debug()).toMatchSnapshot();
        });
    });

    describe('menuIcon', () => {
        test('renders corectly', () => {
            const Comp = menuIcon('accounting-coins-stack');
            expect(shallow(<Comp />).debug()).toMatchSnapshot('unfocused');
            expect(shallow(<Comp focused={true} />).debug()).toMatchSnapshot('focused');
        });
    });

    describe('removeAnimation', () => {
        test('renders corectly', () => {
            const screenProps = { scene: { route: { routeName: 'someScreen' } } };
            expect(removeAnimation(['dummy'])(screenProps)).toBe('animation-interpolation');
            expect(removeAnimation(['someScreen'])(screenProps)).toBeNull;
        });
    });
});
