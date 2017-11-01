// @flow

import type { Database, AggregatedTimetable } from './TypeDefinitions';

const chunks = (array, size) => {
  return array.reduce((acc, item, index) => {
    index % size === 0 && acc.push([]);
    acc[acc.length - 1].push(item);
    return acc;
  }, []);
};

const differenceInMilliseconds = ([a, b]) => b.getTime() - a.getTime();

const add = (a, b) => a + b;

export default function aggregateTimetable(
  timetable: Database
): AggregatedTimetable {
  return Object.keys(timetable).map(task => {
    let tasks = timetable[task].timestamps;

    if (tasks.length % 2 !== 0) tasks = tasks.slice(0, -1);

    const duration = chunks(tasks, 2)
      .map(differenceInMilliseconds)
      .reduce(add, 0);

    return {
      task: timetable[task].name,
      duration,
      id: task
    };
  });
}
