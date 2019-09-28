import React, { useRef } from 'react';
import Counter from './Counter';
import Button from './Button';
import { AggregatedTimetableItem } from '../types';
import styles from './TimetableItem.module.css';

type Props = {
  formatDuration: (value: number) => string;
  item: AggregatedTimetableItem;
  isActive: boolean;
  onMakeActiveClick: () => void;
  onPauseClick: () => void;
  onNameChange: (name: string) => void;
};

function TimetableItem(props: Props) {
  const inputRef = useRef<any>();

  const {
    item,
    formatDuration,
    isActive,
    onPauseClick,
    onMakeActiveClick,
    onNameChange
  } = props;

  const startTime =
    item.timestamps.length % 2 === 1
      ? item.timestamps[item.timestamps.length - 1]
      : new Date();

  return (
    <div className={styles.ListItem}>
      <div style={{ flex: 1 }}>
        <input
          ref={inputRef}
          value={item.task}
          style={{ fontWeight: isActive ? 700 : 400 }}
          onChange={e => onNameChange(e.target.value)}
        />
      </div>

      <Button
        variant={isActive ? 'green' : undefined}
        style={{
          padding: 10,
          width: 100,
          marginLeft: 5,
          fontWeight: isActive ? 700 : 400
        }}
        onClick={isActive ? onPauseClick : onMakeActiveClick}
        title={
          isActive
            ? 'Click to take a pause from this task'
            : 'Work on this task instead'
        }
      >
        <Counter
          initialDuration={item.duration}
          startTime={startTime}
          active={isActive}
          format={value => <span>{formatDuration(value)}</span>}
        />
      </Button>
    </div>
  );
}

export default TimetableItem;
