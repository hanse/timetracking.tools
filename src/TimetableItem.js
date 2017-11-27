// @flow

import React from 'react';
import glamorous, { Div } from 'glamorous';
import { formatName } from './formatters';
import Counter from './Counter';
import Button from './Button';
import type { AggregatedTimetableItem } from './TypeDefinitions';

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

const Bubble = glamorous.div({
  padding: '6px 10px',
  borderRadius: 5,
  backgroundColor: '#ddd',
  marginLeft: 10,
  width: 100,
  textAlign: 'center'
});

type Props = {
  formatDuration: (value: number) => string,
  item: AggregatedTimetableItem,
  isActive: boolean,
  onMakeActiveClick: () => void,
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
      onMakeActiveClick,
      onNameChange
    } = this.props;

    return (
      <ListItem isActive={isActive}>
        <Div flex={1}>
          {!this.state.editing ? (
            <span onClick={() => this.setState({ editing: true })}>
              {formatName(item.task)}
            </span>
          ) : (
            <input
              ref={ref => (this.inputRef = ref)}
              value={item.task}
              onKeyDown={this.handleKeyDown}
              onChange={e => onNameChange(e.target.value)}
            />
          )}
        </Div>

        <Div display="flex">
          {!isActive && (
            <Button onClick={onMakeActiveClick}>Work on this instead</Button>
          )}

          <Bubble>
            <Counter
              initialCounter={item.duration}
              active={isActive}
              format={formatDuration}
            />
          </Bubble>
        </Div>
      </ListItem>
    );
  }
}

export default TimetableItem;
