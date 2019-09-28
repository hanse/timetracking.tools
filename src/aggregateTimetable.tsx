import format from 'date-fns/fp/format';
import { Database, AggregatedTimetable, AggregatedCSV } from './types';

const chunks = (array: Array<any>, size: number) => {
  return array.reduce((acc, item, index) => {
    index % size === 0 && acc.push([]);
    acc[acc.length - 1].push(item);
    return acc;
  }, []);
};

const differenceInMilliseconds = ([a, b]: [Date, Date]) =>
  b.getTime() - a.getTime();

const add = (a: number, b: number) => a + b;

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
      id: task,
      timestamps: tasks
    };
  });
}

function groupBy<T>(group: (item: T) => string) {
  return (collection: Array<T>) => {
    return collection.reduce<{ [key: string]: Array<T> }>((acc, item) => {
      const key = group(item);
      acc[key] = (acc[key] || []).concat(item);
      return acc;
    }, {});
  };
}

export function aggregateCSV(timetable: Database): AggregatedCSV {
  return Object.keys(timetable).map(task => {
    let timestampsByDate = groupBy(format('yyyy-MM-dd'))(
      timetable[task].timestamps
    );

    return {
      task: timetable[task].name,
      daily: Object.keys(timestampsByDate)
        .map(date => {
          let timestamps = timestampsByDate[date];
          if (timestamps.length % 2 !== 0) timestamps = timestamps.slice(0, -1);

          const duration = chunks(timestamps, 2)
            .map(differenceInMilliseconds)
            .reduce(add, 0);

          return {
            duration,
            date
          };
        })
        .reduce<any>((acc, item) => {
          acc[item.date] = item.duration;
          return acc;
        }, {})
    };
  });
}
