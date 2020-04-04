import React, { useCallback, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import format from 'date-fns/format';
import { createBrowserHistory as createHistory, Location } from 'history';
import { ErrorBoundary, Stack, ThemeProvider, createTheme } from '@devmoods/ui';
import useAbortablePromise from 'use-abortable-promise';
import * as Sentry from '@sentry/browser';
import App from './components/App';
import * as db from './db';
import { Task } from './types';
import { parse, parseISO } from 'date-fns';
import './index.css';
import Header from './components/Header';
import '@devmoods/ui/dist/styles.css';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN
  });
}

function onError(error: Error, errorInfo: any) {
  Sentry.withScope(scope => {
    scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

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

function Root() {
  const [page, setPage] = useState(() => getDate(history.location));

  useEffect(() => {
    return history.listen(() => {
      setPage(getDate(history.location));
    });
  }, []);

  return <Loader date={page} history={history} />;
}

const theme = createTheme({
  primaryColor: '#1B1D25'
});

ReactDOM.render(
  <ErrorBoundary onError={onError}>
    <ThemeProvider theme={theme}>
      <Stack
        padding={16}
        paddingTop={32}
        style={{ maxWidth: 960, margin: '0 auto' }}
      >
        <Header />
        <Root />
      </Stack>
    </ThemeProvider>
  </ErrorBoundary>,
  rootElement
);
