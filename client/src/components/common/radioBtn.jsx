import React from 'react';

const RadioBtn = ({ id, name, label, value, defaultChecked, onClick }) => (
  <label htmlFor={id}>
    {label}
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
