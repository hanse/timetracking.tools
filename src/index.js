// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import parse from 'date-fns/parse';
import App from './App';
import './index.css';

const rootElement: Element = (document.getElementById('root'): any);

function rehydrateState(parsedJson) {
  if (!parsedJson) {
    return null;
  }

  return {
    ...parsedJson,
    tasks: Object.keys(parsedJson.tasks).reduce((tasks, taskId) => {
      tasks[taskId] = {
        ...parsedJson.tasks[taskId],
        timestamps: parsedJson.tasks[taskId].timestamps.map(parse)
      };
      return tasks;
    }, {})
  };
}

ReactDOM.render(
  <App
    initialState={rehydrateState(
      JSON.parse(window.localStorage.getItem('timetracker') || 'null')
    )}
    saveState={state =>
      window.localStorage.setItem('timetracker', JSON.stringify(state))}
    clearState={() => window.localStorage.removeItem('timetracker')}
  />,
  rootElement
);
