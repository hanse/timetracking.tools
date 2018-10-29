// @flow

import { type Node, useState, useRef, useEffect } from 'react';

type Props = {
  initialDuration: number,
  active: boolean,
  format: number => Node,
  startTime: Date
};

function Counter(props: Props) {
  const counterRef = useRef();
  const [state, setState] = useState({
    value: props.initialDuration
  });

  useEffect(
    () => {
      if (props.active) {
        const interval = setInterval(() => {
          setState(state => ({
            ...state,
            value:
              Date.now() - props.startTime.getTime() + props.initialDuration
          }));
        }, 500);
        counterRef.current = interval;
      }
      return () => clearInterval(counterRef.current);
    },
    [props.active, props.initialDuration]
  );

  return props.format(state.value);
}

Counter.defaultProps = {
  format: n => n,
  startTime: new Date()
};

export default Counter;
