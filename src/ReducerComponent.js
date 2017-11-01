// @flow

import { PureComponent } from 'react';

class ReducerComponent<Props, State, Action> extends PureComponent<
  Props,
  State
> {
  +reducer: (state: State, action: Action) => State;

  dispatch(action: Action) {
    console.log('ACTION', action);
    this.setState(state => this.reducer(state, action));
  }
}

export default ReducerComponent;
