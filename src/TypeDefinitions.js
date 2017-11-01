// @flow

export type Duration = number;
export type ID = string;
export type Timetable = { [key: ID]: Array<Date> };

export type AggregatedTimetableItem = {|
  task: ID,
  duration: Duration,
  id: string
|};

export type AggregatedTimetable = Array<AggregatedTimetableItem>;

export type Database = {
  [key: ID]: {
    id: string,
    name: string,
    timestamps: Array<Date>
  }
};
