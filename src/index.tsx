import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import format from 'date-fns/format';
import {
  createBrowserHistory as createHistory,
  Location,
  History
} from 'history';
import { ErrorBoundary } from '@devmoods/ui';
import useAbortablePromise from 'use-abortable-promise';
import App from './components/App';
import * as db from './db';
import { Task } from './types';
import { parse, parseISO } from 'date-fns';
import './index.css';

const rootElement = document.getElementById('root');

function rehydrateState(parsedJson: any) {
  if (!parsedJson) {
    return undefined;
  }

  return {
    ...parsedJson,
    tasks: Object.keys(parsedJson.tasks).reduce<{ [key: string]: Task }>(
      (tasks, taskId) => {
        tasks[taskId] = {
          ...parsedJson.tasks[taskId],
          timestamps: parsedJson.tasks[taskId].timestamps.map((date: string) =>
            parseISO(date)
          )
        };
        return tasks;
      },
      {}
    )
  };
}

function toDatabaseKey(date: string) {
  return parse(date, 'yyyy-MM-dd', new Date());
}

function Loader({ date, history }: { date: string; history: any }) {
  const [{ data, loading, error }] = useAbortablePromise(async () => {
    const value = await db.retrieve(toDatabaseKey(date));
    return rehydrateState(value);
  }, [date]);

  const saveState = useCallback(state => db.save(toDatabaseKey(date), state), [
    date
  ]);

  if (error) {
    throw error;
  }

  if (loading) {
    return null;
  }

  return (
    <App
      date={date}
      initialState={data}
      saveState={saveState}
      clearState={() => {}}
      history={history}
    />
  );
}

const getDate = (location: Location): string => {
  if (location.pathname !== '/') {
    return location.pathname.replace(/^\/|\/$/g, '');
  }

  return format(new Date(), 'yyyy-MM-dd');
};

const history = createHistory();

const render = (history: History) => {
  const date = getDate(history.location);
  ReactDOM.render(
    <ErrorBoundary>
      <Loader date={date} history={history} />
    </ErrorBoundary>,
    rootElement
  );
};

history.listen(() => {
  render(history);
});

render(history);
