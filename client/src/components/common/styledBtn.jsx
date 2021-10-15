import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

const StyledBtn = ({ type, text, onClick, onSubmit, hidden, colorType }) => {
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (typeof onSubmit === 'function') {
        onSubmit(e);
      }
    },
    [onSubmit],
  );

  return (
    <StyledButton
      type={type}
      onClick={onClick}
      onSubmit={handleSubmit}
      hidden={hidden}
      colorType={colorType}
    >
      {text}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  ${(props) =>
    props.hidden &&
    css`
      display: none;
    `};
  min-width: 120px;
  padding: 0.7rem 1.2rem;
  border-radius: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  border: none;
  outline: 0;
  color: white;
  border: solid 2px white;
  transition: all 0.3s ease-in;

  ${(props) =>
    props.colorType === 'stylish'
      ? css`
          background: linear-gradient(88.75deg, #4a4bf8 0.73%, #ec58d4 102.47%);
          :hover {
            background: transparent;
            transform: scale(1.1);
          }
        `
      : css`
          background: white;
          color: black;
        `};
`;

export default StyledBtn;

/* animation: 2s linear infinite alternate change_color; */
/* @keyframes change_color {
} */
