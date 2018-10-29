// @flow

import React, { useRef, useEffect } from 'react';

type Props = {
  onClickOutside: () => mixed
};

function ClickOutside(props: Props) {
  const container = useRef();

  const { onClickOutside, ...restProps } = props;
  const handleClick = (e: MouseEvent) => {
    const target: Node = (e.target: any);
    if (container.current && !container.current.contains(target)) {
      onClickOutside();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return <div ref={container} {...restProps} />;
}

export default ClickOutside;
