import PouchDB from 'pouchdb';
import { format } from 'date-fns';
import { Database, Task } from './types';
import { State } from './components/App';

const db = new PouchDB('timetracker');

function id(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export async function save<T extends State>(date: Date, data: T | null) {
  const document = await retrieve<{ _id: string; tasks: T | null }>(date);

  if (document != null) {
    document.tasks = data;
    return db.put(document);
  }

  return db.put({
    _id: id(date),
    tasks: data
  });
}

export async function retrieve<T>(date: Date): Promise<T | null> {
  try {
    const document = await db.get(id(date));
    return document as any;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }

    throw error;
  }
}
