// @flow

import React from 'react';
import cuid from 'cuid';
import ReducerComponent from './ReducerComponent';
import TimetableItem from './TimetableItem';
import { formatName, formatTime, formatHalfHours } from './formatters';
import aggregateTimetable from './aggregateTimetable';
import type { Database, ID } from './TypeDefinitions';

type State = {
  active: ?ID,
  tasks: Database,
  exact: boolean
};

type Props = {
  initialState: ?State,
  saveState: State => void,
  clearState: () => void
};

type Action =
  | {|
      type: 'NEW_TASK',
      id: ID,
      task: ID,
      date: Date
    |}
  | {|
      type: 'FINISH',
      date: Date
    |}
  | {|
      type: 'TOGGLE_EXACT'
    |}
  | {
      type: 'CHANGE_NAME',
      id: ID,
      name: string
    };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'TOGGLE_EXACT':
      return {
        ...state,
        exact: !state.exact
      };

    case 'FINISH':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          ...(state.active &&
          state.tasks[state.active].timestamps.length % 2 === 1
            ? {
                [state.active]: {
                  ...state.tasks[state.active],
                  timestamps: [
                    ...(state.tasks[state.active].timestamps || []),
                    action.date
                  ]
                }
              }
            : {})
        },
        active: null
      };

    case 'NEW_TASK': {
      const taskName = action.task;
      const existingId = Object.keys(state.tasks).find(
        taskId => state.tasks[taskId].name === taskName
      );
      const id = existingId ? existingId : action.id;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          ...(state.active
            ? {
                [state.active]: {
                  ...state.tasks[state.active],
                  timestamps: [
                    ...(state.tasks[state.active].timestamps || []),
                    action.date
                  ]
                }
              }
            : {}),
          [id]: {
            name: action.task,
            timestamps: [
              ...((state.tasks[id] || {}).timestamps || []),
              action.date
            ]
          }
        },
        active: id
      };
    }

    case 'CHANGE_NAME':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.id]: {
            ...state.tasks[action.id],
            name: action.name
          }
        }
      };

    default:
      return state;
  }
}

class App extends ReducerComponent<Props, State, Action> {
  state = this.props.initialState || {
    exact: true,
    active: null,
    tasks: {}
  };

  reducer = reducer;

  componentDidUpdate() {
    this.props.saveState(this.state);
  }

  render() {
    const { tasks, exact, active } = this.state;
    const formatDuration = exact ? formatTime : formatHalfHours;

    const activeTask = active ? tasks[active] : {};

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, height: '100vh', padding: 40 }}>
          <h1>Timetracker</h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <strong>Currently working on {formatName(activeTask.name)}</strong>

            <label>
              <input
                type="checkbox"
                checked={!exact}
                onChange={() => this.dispatch({ type: 'TOGGLE_EXACT' })}
              />
              Show half hours
            </label>
          </div>

          {aggregateTimetable(tasks).map((item, index) => (
            <TimetableItem
              key={item.id}
              item={item}
              isActive={item.id === active}
              formatDuration={formatDuration}
              onNameChange={name => {
                this.dispatch({
                  type: 'CHANGE_NAME',
                  id: item.id,
                  name
                });
              }}
              onMakeActiveClick={() =>
                this.dispatch({
                  type: 'NEW_TASK',
                  id: item.id,
                  task: item.task,
                  date: new Date()
                })}
            />
          ))}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 20,
              backgroundColor: '#F4F3F4',
              marginTop: 20,
              borderRadius: 3
            }}
          >
            <AddTaskForm
              onSubmit={task =>
                this.dispatch({
                  type: 'NEW_TASK',
                  id: cuid(),
                  task,
                  date: new Date()
                })}
            />

            <button
              className="red"
              onClick={() =>
                this.dispatch({ type: 'FINISH', date: new Date() })}
            >
              I am going home
            </button>
          </div>

          <button
            className="gray"
            style={{ marginTop: 20, padding: '7px 15px' }}
            onClick={this.props.clearState}
          >
            Clear localStorage
          </button>
        </div>

        <div
          style={{
            flex: 1,
            height: '100vh',
            padding: 40,
            overflow: 'scroll'
          }}
        >
          <pre>{JSON.stringify(tasks, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

const AddTaskForm = ({ onSubmit }) => {
  let input;

  const handleSubmit = (e: SyntheticEvent<*>) => {
    if (!input) return;
    e.preventDefault();
    input.value !== '' && onSubmit(input.value);
    input.value = '';
    input.focus();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
      <input
        ref={ref => (input = ref)}
        type="text"
        placeholder="What did you just start on?"
      />

      <button type="submit" style={{ marginLeft: 5 }}>
        Go
      </button>
    </form>
  );
};

export default App;
