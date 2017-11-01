// @flow

import React from 'react';

type Props = {
  initialCounter: number,
  active: boolean,
  format: number => string
};

type State = {
  counter: number
};

class Counter extends React.PureComponent<Props, State> {
  static defaultProps = {
    format: n => n
  };

  state = {
    counter: this.props.initialCounter
  };

  counter: number;

  componentDidMount() {
    if (this.props.active) {
      this.startTimer();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.initialCounter > this.state.counter) {
      this.setState({ counter: nextProps.initialCounter });
    }

    if (this.props.active && !nextProps.active) {
      this.stopTimer();
    }

    if (!this.props.active && nextProps.active) {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.counter = setInterval(
      () => this.setState(state => ({ counter: state.counter + 1000 })),
      1000
    );
  }

  stopTimer() {
    clearInterval(this.counter);
  }

  render() {
    return this.props.format(this.state.counter);
  }
}

export default Counter;
