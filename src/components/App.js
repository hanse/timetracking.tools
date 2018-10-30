// @flow

import React, { useReducer, useEffect } from 'react';
import cuid from 'cuid';
import { Div, Label } from 'glamorous';
import { produce } from 'immer';
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

const reducer = (state: State = initialState, action: Action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'TOGGLE_EXACT':
        draft.exact = !state.exact;
        return;

      case 'FINISH':
        if (
          state.active &&
          state.tasks[state.active].timestamps.length % 2 === 1
        ) {
          draft.tasks[state.active].timestamps.push(action.date);
        }
        draft.active = null;
        return;

      case 'NEW_TASK':
        const taskName = action.task;
        const existingId = Object.keys(state.tasks).find(
          taskId =>
            state.tasks[taskId].name.toLowerCase() === taskName.toLowerCase()
        );

        const id = existingId ? existingId : action.id;

        draft.active = id;
        if (state.active) {
          draft.tasks[state.active].timestamps.push(action.date);
        }

        draft.tasks[id] = {
          id: id,
          name: action.task,
          timestamps: [
            ...((state.tasks[id] || {}).timestamps || []),
            action.date
          ]
        };
        return;

      case 'CHANGE_NAME':
        draft.tasks[action.id].name = action.name;
        return;

      case 'CLEAR_STATE':
        draft.tasks = {};
        draft.exact = true;
        draft.active = null;
        return;

      default:
        return state;
    }
  });

const onToggleExact = () => ({ type: 'TOGGLE_EXACT' });

const onTaskAdded = (task: string) => ({
  type: 'NEW_TASK',
  id: cuid(),
  task,
  date: new Date()
});

const onMakeActiveClicked = (item: AggregatedTimetableItem) => ({
  type: 'NEW_TASK',
  id: item.id,
  task: item.task,
  date: new Date()
});

const onTaskNameChanged = (item: AggregatedTimetableItem) => (
  name: string
) => ({
  type: 'CHANGE_NAME',
  id: item.id,
  name
});

const onFinishClicked = () => ({ type: 'FINISH', date: new Date() });

function useOnBeforeUnload(fn) {
  useEffect(() => {
    window.onbeforeunload = () => {
      fn();
    };
    return () => {
      window.onbeforeunload = null;
    };
  });
}

function App(props: Props) {
  const [state, dispatch] = useReducer(reducer, props.initialState, {
    type: 'INIT'
  });

  useOnBeforeUnload(() => {
    dispatch(onFinishClicked());
  });

  useEffect(() => props.saveState(state), [state]);
  useEffect(() => {
    const task = state.active ? state.tasks[state.active].name : 'nothing';
    document.title = `Timetracker: ${task}`;
  });

  const { tasks, exact, active } = state;
  const formatDuration = exact ? formatTime : formatHalfHours;

  const activeTask = active ? tasks[active] : {};

  const handleClear = () => {
    dispatch({ type: 'CLEAR_STATE' });
    props.clearState();
  };

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
                  onChange={() => dispatch(onToggleExact())}
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
                onNameChange={name => dispatch(onTaskNameChanged(item)(name))}
                onMakeActiveClick={() => dispatch(onMakeActiveClicked(item))}
                onPauseClick={() => dispatch(onFinishClicked())}
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
              <AddTaskForm onSubmit={task => dispatch(onTaskAdded(task))} />

              <Button red onClick={() => dispatch(onFinishClicked())}>
                I am going home
              </Button>
            </Div>

            <Button
              neutral
              css={{ marginTop: 20, padding: '7px 15px' }}
              onClick={handleClear}
            >
              Clear State
            </Button>
          </Div>
        </Div>

        <Div flex={1} overflowY="scroll" fontSize={14} padding={20}>
          <pre>{JSON.stringify(aggregateCSV(tasks), null, 2)}</pre>
        </Div>
      </Div>
    </Div>
  );
}

export default App;
