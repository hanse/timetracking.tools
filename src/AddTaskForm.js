import React from 'react';
import Button from './Button';

const AddTaskForm = ({ onSubmit }) => {
  let input;

  const handleSubmit = (e: SyntheticEvent<*>) => {
    if (!input) return;
    e.preventDefault();
    input.value !== '' && onSubmit(input.value);
    input.value = '';
    input.focus();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
      <input
        ref={ref => (input = ref)}
        type="text"
        placeholder="What did you just start on?"
      />

      <Button type="submit" style={{ marginLeft: 5 }}>
        Go
      </Button>
    </form>
  );
};

export default AddTaskForm;
