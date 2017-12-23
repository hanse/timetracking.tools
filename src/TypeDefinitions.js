// @flow

export type Duration = number;
export type ID = string;
export type Timetable = { [key: ID]: Array<Date> };

export type AggregatedTimetableItem = {|
  task: ID,
  duration: Duration,
  id: string,
  timestamps: Array<Date>
|};

export type AggregatedTimetable = Array<AggregatedTimetableItem>;

export type Task = {|
  id: string,
  name: string,
  timestamps: Array<Date>
|};

export type Database = {
  [key: ID]: Task
};
