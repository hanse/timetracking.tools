// @flow

// $FlowFixMe
import React, { useRef, useState, useEffect } from 'react';
import glamorous, { Div } from 'glamorous';
import { formatName } from '../formatters';
import Counter from './Counter';
import Button from './Button';
import ClickOutside from './ClickOutside';
import type { AggregatedTimetableItem } from '../TypeDefinitions';

const ListItem = glamorous.div(
  {
    fontWeight: ({ isActive }) => (isActive ? '700' : '400'),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 3,
    '&:nth-child(odd)': {
      backgroundColor: '#f4f3f4'
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
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();

  useEffect(
    () => {
      inputRef.current && inputRef.current.focus();
      inputRef.current &&
        inputRef.current.setSelectionRange(
          props.item.task.length,
          props.item.task.length + 1
        );
    },
    [editing]
  );

  const handleKeyDown = (e: SyntheticKeyboardEvent<*>) => {
    if (e.which === 27 || e.which === 13) {
      setEditing(false);
    }
  };

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
        {!editing ? (
          <span onClick={() => setEditing(true)}>{formatName(item.task)}</span>
        ) : (
          <ClickOutside onClickOutside={() => setEditing(false)}>
            <input
              ref={inputRef}
              value={item.task}
              onKeyDown={handleKeyDown}
              onChange={e => onNameChange(e.target.value)}
            />
          </ClickOutside>
        )}
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
