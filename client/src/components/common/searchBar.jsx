import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import styled, { css } from 'styled-components';

const SearchBar = ({
  name,
  loading,
  placeholder,
  value,
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
  colorType,
}) => (
  <SearchBarWrapper colorType={colorType}>
    {loading ? (
      <FontAwesomeIcon
        icon={faCircleNotch}
        spin
        color={colorType === 'basic' ? 'white' : 'black'}
      />
    ) : (
      <FontAwesomeIcon
        icon={faSearch}
        color={colorType === 'basic' ? 'white' : 'black'}
      />
    )}
    <input
      type="search"
      id={`search--${name}`}
      name={name}
      placeholder={placeholder}
      value={value}
      onKeyDown={onKeyDown}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      autoComplete="off"
    />
  </SearchBarWrapper>
);

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  & > svg {
    position: absolute;
    right: 1.2rem;
    font-size: 1.7rem;
    z-index: 1;
    opacity: 0.5;
  }

  & > input {
    ::-ms-clear,
    ::-ms-reveal {
      display: none;
      width: 0;
      height: 0;
    }
    ::-webkit-search-decoration,
    ::-webkit-search-cancel-button,
    ::-webkit-search-results-button,
    ::-webkit-search-results-decoration {
      display: none;
    }

    ${(props) =>
      props.colorType === 'basic'
        ? css`
            background: transparent;
            border: solid 1px white;
            color: white;
          `
        : css`
            background: white;
            border: solid 1px black;
            color: black;
          `};
    width: 100%;
    height: 2.7rem;
    border-radius: 20px;
    padding-left: 1.5rem;
    font-size: 1.1rem;
    transition: 200ms;
    :focus {
      outline: none;
      border-radius: 5px;
    }
  }
`;

export default SearchBar;
