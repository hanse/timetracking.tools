import PouchDB from 'pouchdb';
import { format } from 'date-fns';
import { TODO } from './types';

const db = new PouchDB('timetracker');

function id(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export async function save(date: Date, tasks: TODO) {
  const document: any = await retrieve(date);

  if (document != null) {
    document.tasks = tasks;
    return db.put(document);
  }

  return db.put({
    _id: id(date),
    tasks
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
