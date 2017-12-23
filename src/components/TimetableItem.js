// @flow

import React from 'react';
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

type State = {
  editing: boolean
};

class TimetableItem extends React.PureComponent<Props, State> {
  state = {
    editing: false
  };

  inputRef: ?HTMLInputElement;

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.editing && !prevState.editing) {
      this.inputRef && this.inputRef.focus();
      this.inputRef &&
        this.inputRef.setSelectionRange(
          this.props.item.task.length,
          this.props.item.task.length + 1
        );
    }
  }

  handleKeyDown = (e: SyntheticKeyboardEvent<*>) => {
    if (e.which === 27 || e.which === 13) {
      this.setState({ editing: false });
    }
  };

  render() {
    const {
      item,
      formatDuration,
      isActive,
      onPauseClick,
      onMakeActiveClick,
      onNameChange
    } = this.props;

    const startTime =
      item.timestamps.length % 2 === 1
        ? item.timestamps[item.timestamps.length - 1]
        : new Date();

    return (
      <ListItem isActive={isActive}>
        <Div flex={1}>
          {!this.state.editing ? (
            <span onClick={() => this.setState({ editing: true })}>
              {formatName(item.task)}
            </span>
          ) : (
            <ClickOutside
              onClickOutside={() => this.setState({ editing: false })}
            >
              <input
                ref={ref => (this.inputRef = ref)}
                value={item.task}
                onKeyDown={this.handleKeyDown}
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
}

export default TimetableItem;
