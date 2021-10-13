import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart } from '@fortawesome/free-solid-svg-icons';

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
    (e) => {
      if (typeof onClick === 'function') {
        onClick(e);
      }
    },
    [onClick],
  );

  return (
    <StyledImgCheckBox
      checked={defaultChecked === 'true'}
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
      {/* { && <FontAwesomeIcon icon={faHeart} />} */}
    </StyledImgCheckBox>
  );
};

const StyledImgCheckBox = styled.label`
  display: block;
  cursor: pointer;
  opacity: 0.8;
  border: ${(props) =>
    props.checked ? 'solid 2px white' : 'solid 2px transparent'};

  :hover {
    opacity: 1;
  }

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

  & > input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
    padding: 0;
    width: 0;
    height: 0;
    :checked {
      background: black;
    }
  }
  & > img {
    width: 100%;
    height: 100%;
  }
`;

export default ImageCheckBox;
