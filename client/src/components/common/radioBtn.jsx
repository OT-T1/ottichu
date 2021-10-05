import React from 'react';

const RadioBtn = ({ id, name, value, defaultChecked, text, onClick }) => (
  <label htmlFor={id}>
    {text}
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      defaultChecked={defaultChecked}
      onClick={onClick}
    />
  </label>
);

export default RadioBtn;
