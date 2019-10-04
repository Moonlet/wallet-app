import { connect as _connect } from 'react-redux';
import { Store } from '../types/store';
import { Dispatch } from 'redux';

const defaultMergeProps = (
  stateProps: (state: Store) => any,
  dispatchProps: (dispatch: Dispatch) => any,
  ownProps: any,
) => Object.assign({}, ownProps, stateProps, dispatchProps);

export function mapStateToProps(
  mapStateToProps: (state: Store, ownProps?: any) => any,
  options?: any,
) {
  return _connect(
    mapStateToProps,
    // @ts-ignore
    null,
    defaultMergeProps,
    options,
  );
}

export function mapDispatchToProps(
  mapDispatchToProps: (dispatch: Dispatch, ownProps: any) => any,
  options?: any,
) {
  const mapStateToProps = () => ({});
  // @ts-ignore
  return _connect(mapStateToProps, mapDispatchToProps, defaultMergeProps, options);
}

export function connect() {
  // @ts-ignore
  return _connect(...arguments);
}
