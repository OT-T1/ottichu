import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

const StyledBtn = ({ type, text, onClick, onSubmit, colorType }) => {
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
      colorType={colorType}
    >
      {text}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  min-width: 120px;
  padding: 0.7rem 1.2rem;
  border-radius: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  border: none;
  outline: 0;
  color: white;

  ${(props) =>
    props.colorType === 'stylish'
      ? css`
          background: linear-gradient(#4a4bf8, #ec58d4);
          :hover {
            // 임시
            background: transparent;
            border: solid 2px white;
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
