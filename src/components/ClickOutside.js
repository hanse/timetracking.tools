// @flow

import React, { Component } from 'react';

type Props = {
  onClickOutside: () => mixed
};

class ClickOutside extends Component<Props> {
  container: ?HTMLDivElement;

  componentDidMount() {
    document.addEventListener('click', this.handleClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  handleClick = (e: MouseEvent) => {
    const target: Node = (e.target: any);
    if (this.container && !this.container.contains(target)) {
      this.props.onClickOutside();
    }
  };

  render() {
    const { onClickOutside, ...props } = this.props;
    return <div ref={ref => (this.container = ref)} {...props} />;
  }
}

export default ClickOutside;
