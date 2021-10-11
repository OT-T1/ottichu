import React from 'react';

const CheckBox = ({ id, label, value, defaultChecked, onClick }) => (
  <label htmlFor={id}>
    {label}
    <input
      type="checkbox"
      id={id}
      value={value}
      defaultChecked={defaultChecked}
      onClick={onClick}
    />
  </label>
);

export default CheckBox;
