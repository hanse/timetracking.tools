import React, { memo } from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import parse from 'date-fns/parse';
import styles from './Navigation.module.css';

type Props = {
  history: any;
  date: string;
};

const FORMAT = 'iiii, LLLL do';

function Navigation({ date, history }: Props) {
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date());

  const handleChange = (offset: number) => () => {
    history.push('/' + format(addDays(parsedDate, offset), 'yyyy-MM-dd'));
  };

  return (
    <div className={styles.navigation}>
      <h3 className={styles.title}>{format(parsedDate, FORMAT)}</h3>
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={handleChange(-1)}
          title="Previous"
        >
          &larr;
        </button>
        <button
          className={styles.button}
          onClick={handleChange(1)}
          title="Next"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

export default memo(Navigation);
