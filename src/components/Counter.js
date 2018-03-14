// @flow

import React, { type Node } from 'react';

type Props = {
  initialDuration: number,
  active: boolean,
  format: number => Node,
  startTime: Date
};

type State = {
  value: number,
  accumulatedDuration: number
};

class Counter extends React.PureComponent<Props, State> {
  static defaultProps = {
    format: (n: number) => n,
    startTime: new Date()
  };

  state = {
    value: this.props.initialDuration,
    accumulatedDuration: this.props.initialDuration
  };

  counter: IntervalID;

  componentDidMount() {
    if (this.props.active) {
      this.startTimer();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.active && !nextProps.active) {
      this.stopTimer();
    }

    if (!this.props.active && nextProps.active) {
      this.startTimer();
      this.setState({ accumulatedDuration: nextProps.initialDuration });
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.counter = setInterval(
      () =>
        this.setState(state => ({
          value:
            Date.now() -
            this.props.startTime.getTime() +
            this.state.accumulatedDuration
        })),
      200
    );
  }

  stopTimer() {
    clearInterval(this.counter);
  }

  render() {
    return this.props.format(this.state.value);
  }
}

export default Counter;
