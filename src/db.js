import PouchDB from 'pouchdb';
import { format } from 'date-fns/fp';

const db = new PouchDB('timetracker');

function id(date) {
  return format('YYYY-MM-dd')(date);
}

export async function save(date, tasks) {
  const document = await retrieve(date);

  if (document != null) {
    document.tasks = tasks;
    return db.put(document);
  }

  return db.put({
    _id: id(date),
    tasks
  });
}

export async function retrieve(date) {
  try {
    const document = await db.get(id(date));
    return document;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }

    throw error;
  }
}
