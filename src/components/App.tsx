import React, { useReducer, useEffect, useCallback } from 'react';
import cuid from 'cuid';
import { produce } from 'immer';
import TimetableItem from './TimetableItem';
import { formatTime, formatHalfHours } from '../formatters';
import aggregateTimetable from '../aggregateTimetable';
import { Button, Stack, Spacer } from '@devmoods/ui';
import AddTaskForm from './AddTaskForm';
import Navigation from './Navigation';
import { Database, ID, AggregatedTimetableItem } from '../types';

export type State = {
  active: ID | null;
  tasks: Database;
  exact: boolean;
};

type Props = {
  initialState: State | null;
  saveState: (state: State | null) => void;
  clearState: () => void;
  history: any;
  date: string;
};

type Action =
  | {
      type: 'NEW_TASK';
      id: ID;
      task: ID;
      date: Date;
    }
  | {
      type: 'FINISH';
      date: Date;
    }
  | {
      type: 'TOGGLE_EXACT';
    }
  | {
      type: 'CHANGE_NAME';
      id: ID;
      name: string;
    }
  | {
      type: 'CLEAR_STATE';
    }
  | { type: 'INIT' };

const initialState = {
  exact: true,
  active: null,
  tasks: {}
};

const reducer = (state: State, action: Action) =>
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

// const onToggleExact = () => ({ type: 'TOGGLE_EXACT' });

const onTaskAdded = (task: string) => ({
  type: 'NEW_TASK' as const,
  id: cuid(),
  task,
  date: new Date()
});

const onMakeActiveClicked = (item: AggregatedTimetableItem) => ({
  type: 'NEW_TASK' as const,
  id: item.id,
  task: item.task,
  date: new Date()
});

const onTaskNameChanged = (item: AggregatedTimetableItem) => (
  name: string
) => ({
  type: 'CHANGE_NAME' as const,
  id: item.id,
  name
});

const onFinishClicked = () => ({ type: 'FINISH' as const, date: new Date() });

function useOnBeforeUnload(fn: () => void) {
  useEffect(() => {
    window.onbeforeunload = () => {
      fn();
    };

    return () => {
      window.onbeforeunload = null;
    };
  });
}

function App({ saveState, ...props }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    props.initialState || initialState
  );

  useOnBeforeUnload(() => {
    dispatch(onFinishClicked());
  });

  useEffect(() => {
    saveState(state);
  }, [saveState, state]);

  useEffect(() => {
    const task = state.active ? state.tasks[state.active].name : 'nothing';
    document.title = `Timetracker: ${task}`;
  });

  const { tasks, exact, active } = state;
  const formatDuration = exact ? formatTime : formatHalfHours;

  const handleClear = () => {
    (window as any).gtag('event', 'Delete all tasks', {
      event_category: 'Tasks'
    });

    dispatch({ type: 'CLEAR_STATE' });
    props.clearState();
  };

  const handleSubmit = useCallback(task => {
    dispatch(onTaskAdded(task));
  }, []);

  return (
    <>
      <div style={{ flex: 1 }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Navigation history={props.history} date={props.date} />

          {aggregateTimetable(tasks).map(item => (
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

          <div style={{ marginTop: 60, borderRadius: 4 }}>
            <AddTaskForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      <Spacer height={32} />
      <Stack padding={32} alignItems="center">
        <Button
          onClick={() => {
            if (window.confirm('Are you sure')) {
              handleClear();
            }
          }}
          intent="danger"
        >
          Delete Everything
        </Button>
      </Stack>
    </>
  );
}

export default App;
