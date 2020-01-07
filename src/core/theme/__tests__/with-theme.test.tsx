import React from 'react';
import { withTheme } from '../with-theme';
import { shallow } from 'enzyme';
import { ITheme } from '../itheme';
import { darkTheme } from '../../../styles/themes/dark-theme';

describe('Theme:withTheme', () => {
    test('withTheme works properly', () => {
        class Comp extends React.Component {
            public static staticProperty = {
                staticProp: 'staticProp'
            };
            public static fn() {
                return 'static function';
            }

            public render() {
                return <div />;
            }
        }

        const CompWithTheme = withTheme((theme: ITheme) => ({
            div: {
                backgroundColor: theme.colors.cardBackground
            }
        }))(Comp);

        expect(CompWithTheme.fn).toBe(Comp.fn);
        expect(CompWithTheme.staticProperty).toBe(Comp.staticProperty);

        const renderedComp = shallow(<CompWithTheme prop1="value1" prop2="value2" />);
        expect(renderedComp.getElement().props).toEqual({
            children: undefined,
            prop1: 'value1',
            prop2: 'value2',
            styles: {
                div: {
                    backgroundColor: darkTheme.colors.cardBackground
                }
            },
            theme: darkTheme
        });
    });
});
