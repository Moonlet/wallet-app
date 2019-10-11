import { connect as _connect } from 'react-redux';
import { IReduxState } from '../state';
import { Dispatch } from 'redux';

const defaultMergeProps = (
    stateProps: (state: IReduxState) => any,
    dispatchProps: (dispatch: Dispatch) => any,
    ownProps: any
) => ({ ...ownProps, ...stateProps, ...dispatchProps });

export function mapStateToProps(
    mapStateToPropsFn: (state: IReduxState, ownProps?: any) => any,
    options?: any
) {
    return _connect(
        mapStateToPropsFn,
        // @ts-ignore
        null,
        defaultMergeProps,
        options
    );
}

export function mapDispatchToProps(
    mapDispatchToPropsFn: (dispatch: Dispatch, ownProps: any) => any,
    options?: any
) {
    const mapStateToPropsFn = () => ({});
    // @ts-ignore
    return _connect(mapStateToPropsFn, mapDispatchToPropsFn, defaultMergeProps, options);
}

export function connect() {
    // @ts-ignore
    return _connect(...arguments);
}
