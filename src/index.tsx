import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import format from 'date-fns/format';
import createHistory from 'history/createBrowserHistory';
import { css } from 'glamor';
import App from './components/App';
import * as db from './db';
import { TODO } from './types';
import { parse, parseISO } from 'date-fns';

css.insert(`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }
`);

css.insert(`
  body {
    font-size: 22px;
    line-height: 2;
    font-family: system-ui, sans-serif;
    color: #ddd;
    background: #1B1D25;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
`);

css.insert(`
  input {
    font-size: inherit;
    border: 0;
    background: transparent;
    color: #eee;
    height: 44px;
    padding: 10px;
    width: 100%;
  }
`);

css.insert(`
  input[type='checkbox'] {
    margin-right: 10px;
  }`);

css.insert(`
  label {
    cursor: pointer;
  }
`);

const rootElement = document.getElementById('root');

function rehydrateState(parsedJson: any) {
  if (!parsedJson) {
    return undefined;
  }

  console.log(parsedJson);

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
