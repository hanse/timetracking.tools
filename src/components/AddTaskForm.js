// @flow

import React from 'react';
import Button from './Button';

type Props = {
  onSubmit: string => mixed
};

const AddTaskForm = ({ onSubmit }: Props) => {
  let input;

  const handleSubmit = (e: SyntheticEvent<*>) => {
    if (!input) return;
    e.preventDefault();
    input.value !== '' && onSubmit(input.value);
    input.value = '';
    input.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flex: 1,
        background: '#070a11',
        borderRadius: 4,
        padding: '10px'
      }}
    >
      <div style={{ flex: 1 }}>
        <input
          ref={ref => (input = ref)}
          type="text"
          placeholder="What did you just start on?"
        />
      </div>

      <Button
        type="submit"
        style={{
          padding: 10,
          width: 100,
          marginLeft: 5
        }}
        green
      >
        Start
      </Button>
    </form>
  );
};

export default AddTaskForm;
