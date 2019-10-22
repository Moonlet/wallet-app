import React from 'react';
import { shallow } from 'enzyme';
import { DummyScreen, menuIcon } from '../utils';

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
});
