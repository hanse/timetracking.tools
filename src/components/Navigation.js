// @flow

import React from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import toDate from 'date-fns/toDate';

type Props = {
  history: any,
  date: string
};

const FORMAT = 'iiii, LLLL do';

function Navigation({ date, history }: Props) {
  const parsedDate = toDate(date);

  const handleChange = offset => () => {
    history.push(format(addDays(parsedDate, offset), 'YYYY-MM-dd'));
  };

  return (
    <div style={styles.navigation}>
      <button style={styles.button} onClick={handleChange(-1)}>
        &larr; Previous
      </button>
      <strong>{format(parsedDate, FORMAT)}</strong>
      <button style={styles.button} onClick={handleChange(1)}>
        Next &rarr;
      </button>
    </div>
  );
}

const styles = {
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 20,
    borderBottom: '1px solid #eee'
  },
  button: {
    border: 0,
    fontSize: 18,
    cursor: 'pointer',
    color: '#666'
  }
};

export default Navigation;
