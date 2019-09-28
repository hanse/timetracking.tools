// @flow

import React from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import parse from 'date-fns/parse';

type Props = {
  history: any,
  date: string
};

const FORMAT = 'iiii, LLLL do';

function Navigation({ date, history }: Props) {
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date());

  const handleChange = offset => () => {
    history.push('/' + format(addDays(parsedDate, offset), 'yyyy-MM-dd'));
  };

  return (
    <div style={styles.navigation}>
      <strong>{format(parsedDate, FORMAT)}</strong>
      <div>
        <button
          style={styles.button}
          onClick={handleChange(-1)}
          title="Previous"
        >
          &larr;
        </button>
        <button style={styles.button} onClick={handleChange(1)} title="Next">
          &rarr;
        </button>
      </div>
    </div>
  );
}

const styles = {
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
    color: '#ffed6b'
  },
  button: {
    border: 0,
    fontSize: 28,
    padding: 10,
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 700,
    background: 'transparent'
  }
};

export default Navigation;
