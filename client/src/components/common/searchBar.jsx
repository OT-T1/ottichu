import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ id, name, label, notice, options = [], onKeyUp }) => (
  <label htmlFor={id}>
    {label}
    <input
      type="text"
      id={id}
      name={name}
      list={`${id}--list`}
      placeholder={notice}
      onKeyUp={onKeyUp}
    />
    <datalist id={`${id}--list`} size="5">
      {options.map((option) => (
        <option key={`${id}__list--${option}`} label={option} value={option} />
      ))}
    </datalist>
    <FontAwesomeIcon icon={faSearch} />
  </label>
);

export default SearchBar;
