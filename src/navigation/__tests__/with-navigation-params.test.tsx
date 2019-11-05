import React from 'react';
import { withNavigationParams } from '../with-navigation-params';
import { shallow } from 'enzyme';

describe('Theme:withTheme', () => {
    describe('withTheme works properly', () => {
        class Comp extends React.Component {
            public static navigationOptions = {
                test: 'OK'
            };

            public static fn() {
                return 'static function';
            }

            public render() {
                return <div />;
            }
        }

        const CompWithNavigationParams: any = withNavigationParams()(Comp);

        test('static properties are transfered', () => {
            expect(CompWithNavigationParams.fn).toBe(Comp.fn);
            expect(CompWithNavigationParams.navigationOptions).toBe(Comp.navigationOptions);
        });

        const testCases = [
            {
                name: 'no navigation prop',
                props: {
                    navigation: undefined
                }
            },
            {
                name: 'navigation without state',
                props: {
                    navigation: {}
                }
            },
            {
                name: 'navigation without params on state',
                props: {
                    navigation: {
                        state: {}
                    }
                }
            },
            {
                name: 'valid navigation',
                props: {
                    navigation: {
                        state: {
                            params: {
                                param1: 'value1',
                                param2: 'value2'
                            }
                        }
                    }
                }
            }
        ];

        for (const testCase of testCases) {
            test(testCase.name, () => {
                const renderedComp = shallow(<CompWithNavigationParams {...testCase.props} />);
                expect(renderedComp.getElement().props).toMatchSnapshot(testCase.name);
            });
        }
    });
});
