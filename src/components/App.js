// @flow

import React from 'react';
import cuid from 'cuid';
import { Div, Label } from 'glamorous';
import ReducerComponent from './ReducerComponent';
import TimetableItem from './TimetableItem';
import { formatName, formatTime, formatHalfHours } from '../formatters';
import aggregateTimetable, { aggregateCSV } from '../aggregateTimetable';
import Button from './Button';
import Header from './Header';
import AddTaskForm from './AddTaskForm';
import type { Database, ID, AggregatedTimetableItem } from '../TypeDefinitions';

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
      <Div
        display="flex"
        flexDirection="column"
        height="100vh"
        backgroundColor="#f2efef"
      >
        <Header />
        <Div display="flex" flex={1}>
          <Div flex={1} overflowY="auto" padding={20}>
            <Div
              border="1px solid #DAE1E9"
              borderRadius={4}
              padding={20}
              backgroundColor="#fff"
              boxShadow="0 1px 2px 0 rgba(0,0,0,0.05)"
            >
              <Div
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <strong>
                  Currently working on {formatName(activeTask.name)}
                </strong>

                <Label
                  color="#888"
                  display="flex"
                  alignItems="center"
                  fontSize={14}
                >
                  <input
                    type="checkbox"
                    checked={!exact}
                    onChange={this.actions.onToggleExact}
                  />
                  Show half hours
                </Label>
              </Div>

              {aggregateTimetable(tasks).map((item, index) => (
                <TimetableItem
                  key={item.id}
                  item={item}
                  isActive={item.id === active}
                  formatDuration={formatDuration}
                  onNameChange={this.actions.onTaskNameChanged(item)}
                  onMakeActiveClick={this.actions.onMakeActiveClicked(item)}
                  onPauseClick={this.actions.onFinishClicked}
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

                <Button red onClick={this.actions.onFinishClicked}>
                  I am going home
                </Button>
              </Div>

              <Button
                neutral
                css={{ marginTop: 20, padding: '7px 15px' }}
                onClick={this.handleClear}
              >
                Clear State
              </Button>
            </Div>
          </Div>

          <Div flex={1} overflowY="scroll" fontSize={14} padding={20}>
            <pre>{JSON.stringify(aggregateCSV(tasks), null, 2)}</pre>
            <pre>{JSON.stringify(tasks, null, 2)}</pre>
          </Div>
        </Div>
      </Div>
    );
  }
}

export default App;
