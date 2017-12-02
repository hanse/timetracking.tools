import React, { Component } from 'react';

class ClickOutside extends Component {
  componentDidMount() {
    document.addEventListener('click', this.handleClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  handleClick = e => {
    if (this.container && !this.container.contains(e.target)) {
      this.props.onClickOutside();
    }
  };

  render() {
    const { onClickOutside, ...props } = this.props;
    return <div ref={ref => (this.container = ref)} {...props} />;
  }
}

export default ClickOutside;
