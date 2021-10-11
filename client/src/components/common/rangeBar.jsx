import React from 'react';

const RangeBar = ({
  id,
  name,
  label,
  min,
  max,
  step,
  defaultValue,
  onChange,
}) => (
  <label htmlFor={id}>
    {label}
    <input
      type="range"
      id={id}
      name={name}
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  </label>
);

export default RangeBar;
