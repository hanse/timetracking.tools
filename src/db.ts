import PouchDB from 'pouchdb';
import { format } from 'date-fns';
import { State } from './components/App';

const db = new PouchDB('timetracker');

function id(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export async function save<T extends State>(date: Date, data: T) {
  const document = await retrieve<T>(date);

  const json = JSON.parse(JSON.stringify(data));

  if (document != null) {
    document.tasks = json.tasks;
    document.active = json.active;
    document.exact = json.exact;
    return db.put(document);
  }

  return db.put({
    _id: id(date),
    ...json
  });
}

export async function retrieve<T extends State>(date: Date): Promise<T | null> {
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
