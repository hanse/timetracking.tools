// @flow

import { type Node, useState, useRef, useEffect } from 'react';

type Props = {
  initialDuration: number,
  active: boolean,
  format: number => Node,
  startTime: Date
};

function Counter({ active, initialDuration, startTime, format }: Props) {
  const counterRef = useRef();
  const [duration, setDuration] = useState(initialDuration);

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setDuration(Date.now() - startTime.getTime() + initialDuration);
      }, 500);

      counterRef.current = interval;
    }

    return () => {
      if (counterRef.current) {
        clearInterval(counterRef.current);
      }
    };
  }, [active, initialDuration, startTime]);

  return format(duration);
}

export default Counter;
