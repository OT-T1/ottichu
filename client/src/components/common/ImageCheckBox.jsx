import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ImageCheckBox = ({
  id,
  name,
  width,
  height,
  url,
  value,
  defaultChecked,
  onClick,
}) => {
  const handleCheck = useCallback(
    (e) => typeof onClick === 'function' && onClick(e),
    [onClick],
  );

  return (
    <StyledImgCheckBox
      checked={defaultChecked}
      htmlFor={id}
      width={width}
      height={height}
    >
      <input
        id={id}
        type="checkbox"
        value={value}
        defaultChecked={defaultChecked}
        onClick={handleCheck}
      />
      <img src={url} alt={name} />
      <FontAwesomeIcon
        icon={faHeart}
        color={defaultChecked ? '#e01f2d' : 'transparent'}
      />
    </StyledImgCheckBox>
  );
};

const StyledImgCheckBox = styled.label`
  position: relative;
  display: block;
  cursor: pointer;
  transition: all 300ms ease-in;
  opacity: 0.5;

  ${(props) =>
    props.checked &&
    css`
      opacity: 1;
      transform: scale(1.1);
    `}

  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `}
    ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `}
    
  :hover {
    opacity: 1;
    transform: scale(1.1);
  }

  & > input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
    padding: 0;
    width: 0;
    height: 0;
  }

  & > img {
    width: 100%;
    height: 100%;
  }
`;

export default ImageCheckBox;
