// @flow

import React from 'react';
import styled from 'styled-components';
import { formatName } from './formatters';
import Counter from './Counter';
import type { AggregatedTimetableItem } from './TypeDefinitions';

const StyledTimetableItem = styled.div`
  font-weight: ${({ isActive }) => (isActive ? '700' : '400')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 3px;

  &:nth-child(odd) {
    background: #f4f3f4;
  }
`;

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
      <StyledTimetableItem isActive={isActive}>
        <div style={{ flex: 1 }}>
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
        </div>

        <div style={{ display: 'flex' }}>
          {!isActive && (
            <button onClick={onMakeActiveClick}>Work on this instead</button>
          )}

          <div
            style={{
              padding: '6px 10px',
              borderRadius: 5,
              backgroundColor: '#ddd',
              marginLeft: 10,
              width: 100,
              textAlign: 'center'
            }}
          >
            <Counter
              initialCounter={item.duration}
              active={isActive}
              format={formatDuration}
            />
          </div>
        </div>
      </StyledTimetableItem>
    );
  }
}

export default TimetableItem;
