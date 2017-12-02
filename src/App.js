// @flow

import React from 'react';
import cuid from 'cuid';
import { Div } from 'glamorous';
import ReducerComponent from './ReducerComponent';
import TimetableItem from './TimetableItem';
import { formatName, formatTime, formatHalfHours } from './formatters';
import aggregateTimetable, { aggregateCSV } from './aggregateTimetable';
import Button from './Button';
import AddTaskForm from './AddTaskForm';
import type { Database, ID, AggregatedTimetableItem } from './TypeDefinitions';

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
    }
  | {
      type: 'CLEAR_STATE'
    }
  | { type: 'INIT' };

const initialState = {
  exact: true,
  active: null,
  tasks: {}
};

function reducer(state: State = initialState, action: Action) {
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

    case 'CLEAR_STATE':
      return initialState;

    default:
      return state;
  }
}

class App extends ReducerComponent<Props, State, Action> {
  reducer = reducer;
  state = this.reducer(this.props.initialState || undefined, { type: 'INIT' });

  actions = {
    onToggleExact: () => this.dispatch({ type: 'TOGGLE_EXACT' }),
    onTaskAdded: (task: string) =>
      this.dispatch({
        type: 'NEW_TASK',
        id: cuid(),
        task,
        date: new Date()
      }),
    onMakeActiveClicked: (item: AggregatedTimetableItem) => () =>
      this.dispatch({
        type: 'NEW_TASK',
        id: item.id,
        task: item.task,
        date: new Date()
      }),
    onTaskNameChanged: (item: AggregatedTimetableItem) => (name: string) => {
      this.dispatch({
        type: 'CHANGE_NAME',
        id: item.id,
        name
      });
    },
    onFinishClicked: () => this.dispatch({ type: 'FINISH', date: new Date() })
  };

  componentDidMount() {
    window.onbeforeunload = () => {
      this.actions.onFinishClicked();
      this.props.saveState(this.state);
    };
  }

  componentDidUpdate() {}

  handleClear = () => {
    this.dispatch({ type: 'CLEAR_STATE' });
    this.props.clearState();
  };

  render() {
    const { tasks, exact, active } = this.state;
    const formatDuration = exact ? formatTime : formatHalfHours;

    const activeTask = active ? tasks[active] : {};

    return (
      <Div display="flex">
        <Div flex={1} height="100vh" padding={40}>
          <h1>Timetracker</h1>
          <Div
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <strong>Currently working on {formatName(activeTask.name)}</strong>

            <label>
              <input
                type="checkbox"
                checked={!exact}
                onChange={this.actions.onToggleExact}
              />
              Show half hours
            </label>
          </Div>

          {aggregateTimetable(tasks).map((item, index) => (
            <TimetableItem
              key={item.id}
              item={item}
              isActive={item.id === active}
              formatDuration={formatDuration}
              onNameChange={this.actions.onTaskNameChanged(item)}
              onMakeActiveClick={this.actions.onMakeActiveClicked(item)}
            />
          ))}

          <Div
            display="flex"
            justifyContent="space-between"
            padding={20}
            backgroundColor="#F4F3F4"
            marginTop={20}
            borderRadius={3}
          >
            <AddTaskForm onSubmit={this.actions.onTaskAdded} />

            <Button light onClick={this.actions.onFinishClicked}>
              I am going home
            </Button>
          </Div>

          <Button
            neutral
            css={{ marginTop: 20, padding: '7px 15px', color: '#666' }}
            onClick={this.handleClear}
          >
            Clear State
          </Button>
        </Div>

        <Div
          flex={1}
          height="100vh"
          padding={40}
          overflow="scroll"
          fontSize={14}
        >
          <pre>{JSON.stringify(aggregateCSV(tasks), null, 2)}</pre>
          <pre>{JSON.stringify(tasks, null, 2)}</pre>
        </Div>
      </Div>
    );
  }
}

export default App;
