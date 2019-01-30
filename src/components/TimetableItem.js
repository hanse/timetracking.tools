// @flow

import React, { useRef } from 'react';
import glamorous, { Div } from 'glamorous';
import Counter from './Counter';
import Button from './Button';
import type { AggregatedTimetableItem } from '../types';

const ListItem = glamorous.div(
  {
    fontWeight: ({ isActive }) => (isActive ? '700' : '400'),
    display: 'flex',
    borderRadius: 4,
    padding: 10,
    '&:nth-child(odd)': {
      backgroundColor: '#070a11'
    }
  },
  ({ isActive }) => ({
    fontWeight: isActive ? '700' : '400'
  })
);

type Props = {
  formatDuration: (value: number) => string,
  item: AggregatedTimetableItem,
  isActive: boolean,
  onMakeActiveClick: () => void,
  onPauseClick: () => void,
  onNameChange: (name: string) => void
};

function TimetableItem(props: Props) {
  const inputRef = useRef();

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
    <ListItem isActive={isActive}>
      <Div flex={1}>
        <input
          ref={inputRef}
          value={item.task}
          style={{ fontWeight: isActive ? 700 : 400 }}
          onChange={e => onNameChange(e.target.value)}
        />
      </Div>

      <Button
        green={isActive}
        css={{
          padding: 10,
          width: 100,
          marginLeft: 5,
          fontWeight: isActive ? '700' : '400'
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
    </ListItem>
  );
}

export default TimetableItem;
