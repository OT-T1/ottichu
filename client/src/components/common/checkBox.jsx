import React from 'react';
import styled, { css } from 'styled-components';

const CheckBox = ({ id, label, value, defaultChecked, onClick, colorType }) => (
  <StyledCheckBox checked={defaultChecked} colorType={colorType} htmlFor={id}>
    <input
      type="checkbox"
      id={id}
      value={value}
      defaultChecked={defaultChecked}
      onClick={onClick}
      placeholder={label}
    />
    {label}
  </StyledCheckBox>
);

const StyledCheckBox = styled.label`
  display: inline-block;
  min-width: 160px;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  word-break: keep-all;
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

export default CheckBox;
