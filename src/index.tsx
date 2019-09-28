import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import format from 'date-fns/format';
import { createBrowserHistory as createHistory } from 'history';
import App from './components/App';
import * as db from './db';
import { TODO } from './types';
import { parse, parseISO } from 'date-fns';
import './index.css';

const rootElement = document.getElementById('root');

function rehydrateState(parsedJson: any) {
  if (!parsedJson) {
    return undefined;
  }

  return {
    ...parsedJson,
    tasks: Object.keys(parsedJson.tasks).reduce<any>((tasks, taskId) => {
      tasks[taskId] = {
        ...parsedJson.tasks[taskId],
        timestamps: parsedJson.tasks[taskId].timestamps.map((date: string) =>
          parseISO(date)
        )
      };
      return tasks;
    }, {})
  };
}

function Loader({ date, history }: { date: string; history: any }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const parsedDate = useMemo(() => {
    return parse(date, 'yyyy-MM-dd', new Date());
  }, [date]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await db.retrieve<TODO>(parsedDate);
      setData((result || {}).tasks);
      setLoading(false);
    })();
  }, [parsedDate]);

  if (loading) {
    return null;
  }

  return (
    <App
      date={date}
      initialState={rehydrateState(data)}
      saveState={state => db.save(parsedDate, state)}
      clearState={() => {}}
      history={history}
    />
  );
}

const getDate = (location: TODO): string => {
  if (location.pathname !== '/') {
    return location.pathname.replace(/^\/|\/$/g, '');
  }

  return format(new Date(), 'yyyy-MM-dd');
};

const render = (history: TODO) => {
  const date = getDate(history.location);
  ReactDOM.render(<Loader date={date} history={history} />, rootElement);
};

const history = createHistory();

history.listen(() => {
  render(history);
});

render(history);
