import React, { useEffect, useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import format from 'date-fns/format';
import {
  createBrowserHistory as createHistory,
  Location,
  History
} from 'history';
import App, { State } from './components/App';
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

function Loader({ date, history }: { date: string; history: any }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<State | null>(null);

  const parsedDate = useMemo(() => {
    return parse(date, 'yyyy-MM-dd', new Date());
  }, [date]);

  const saveState = useCallback(state => db.save(parsedDate, state), [
    parsedDate
  ]);

  useEffect(() => {
    let current = true;
    (async () => {
      current && setLoading(true);
      const result = await db.retrieve(parsedDate);
      if (current && result != null) {
        setData(result.tasks);
      }
      current && setLoading(false);
    })();

    return () => {
      current = false;
    };
  }, [parsedDate]);

  if (loading) {
    return null;
  }

  return (
    <App
      date={date}
      initialState={rehydrateState(data)}
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
  ReactDOM.render(<Loader date={date} history={history} />, rootElement);
};

history.listen(() => {
  render(history);
});

render(history);
