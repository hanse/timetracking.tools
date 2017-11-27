// @flow

import 'glamor/reset';
import React from 'react';
import ReactDOM from 'react-dom';
import parse from 'date-fns/parse';
import { css } from 'glamor';
import App from './App';

css.insert(`
  body {
    font-size: 20px;
    line-height: 2;
    font-family: system-ui, sans-serif;
    color: #333;
  }

  input {
    font-size: inherit;
    padding: 10px 15px;
    border-radius: 3px;
    border: 1px solid #ccc;
    min-width: 320px;
  }

  input[type='checkbox'] {
    margin-right: 10px;
  }

  label {
    cursor: pointer;
  }
`);

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
      window.localStorage.setItem('timetracker', JSON.stringify(state))
    }
    clearState={() => window.localStorage.removeItem('timetracker')}
  />,
  rootElement
);
