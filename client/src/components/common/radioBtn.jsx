import React from 'react';
import styled, { css } from 'styled-components';

const RadioBtn = ({
  id,
  name,
  label,
  value,
  defaultChecked,
  onClick,
  colorType,
}) => (
  <StyledRadioBtn checked={defaultChecked} colorType={colorType} htmlFor={id}>
    {label}
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      defaultChecked={defaultChecked}
      onClick={onClick}
    />
  </StyledRadioBtn>
);

const StyledRadioBtn = styled.label`
  display: inline-block;
  min-width: 150px;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  word-break: keep-all;
  transition: all 300ms ease-in;
  ${(props) =>
    props.colorType === 'orange' &&
    css`
      background: #ed3f3f;
      border: ${props.checked
        ? '3px solid #ffffff'
        : '3px solid #ed3f3f'}; //e4e017
      :hover {
        background: transparent;
        border: 3px solid #e810b9;
        transform: scale(1.1);
      }
    `}
  ${(props) =>
    props.colorType === 'blue' &&
    css`
      background: #304ffe;
      border: ${props.checked ? '3px solid #ffffff' : '3px solid #304ffe'};
      :hover {
        background: #7a7cff;
        border: 3px solid #7a7cff;
        transform: scale(1.1);
      }
    `}

  & > input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }
`;

export default RadioBtn;
