import React, { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

const RangeBar = ({
  id,
  name,
  label,
  required,
  min,
  max,
  step,
  unit,
  width,
  height,
  colorType,
  fontSize,
  value,
  onInput,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const trackSize = useMemo(() => {
    const sizeUnit = /[a-z%]+/.exec(height)[0];
    const size = Number(height.replace(/[a-z%]/gi, ''));
    return `${size / 5}${sizeUnit}`;
  }, [height]);

  // TODO: 포팅 예정.
  // const handleMouseDown = useCallback(() => setOnActivate(true), []);
  // const handleMouseStart = useCallback(() => {}, []);
  // const handleMouseUp = useCallback(() => setOnActivate(false), []);
  // const handleTouchEnd = useCallback((e) => {}, [unlockEndHandler]);

  const handleInput = useCallback(
    (e) => {
      setCurrentValue(e.target.value);
      if (typeof onInput === 'function') {
        onInput(e);
      }
    },
    [onInput],
  );

  return (
    <StyledRangeBarWrapper
      htmlFor={id}
      width={width}
      height={height}
      trackSize={trackSize}
      fontSize={fontSize}
      colorType={colorType}
      required={required}
    >
      <span>{label}</span>
      <StyledRangeBar>
        <input
          type="range"
          id={id}
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={handleInput}
          list={`${id}--tickmarks`}
          // onMouseDown={handleMouseDown}
          // onMouseMove={handleMouseStart}
          // onMouseUp={handleMouseUp}
          // onTouchEnd={handleMouseEnd}
        />
        <StyledValueRange id={`${id}--tickmarks`}>
          <option value={min} label={`${currentValue}${unit}`} />
          <option value={max} label={`${max}${unit}`} />
        </StyledValueRange>
      </StyledRangeBar>
    </StyledRangeBarWrapper>
  );
};

const StyledRangeBarWrapper = styled.label`
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '1rem')};

  ${(props) =>
    props.required &&
    css`
      & > span {
        ::after {
          content: '*';
          color: red;
          margin-left: 0.1rem;
        }
      }
    `}
`;

const StyledRangeBar = styled.div`
  display: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  & > input {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    min-width: 25vw;
    cursor: -webkit-grab;
    /* position: absolute; */
    /* left: 50%; */
    /* top: 50%; */
    /* margin-top: 10px; */
    /* transform: translate(-50%, -50%); */

    ::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      background: rgba(59, 173, 227, 1);
      background: -moz-linear-gradient(
        45deg,
        rgba(59, 173, 227, 1) 0%,
        rgba(87, 111, 230, 1) 25%,
        rgba(152, 68, 183, 1) 51%,
        rgba(255, 53, 127, 1) 100%
      );
      background: -webkit-gradient(
        left bottom,
        right top,
        color-stop(0%, rgba(59, 173, 227, 1)),
        color-stop(25%, rgba(87, 111, 230, 1)),
        color-stop(51%, rgba(152, 68, 183, 1)),
        color-stop(100%, rgba(255, 53, 127, 1))
      );
      background: -webkit-linear-gradient(
        45deg,
        rgba(59, 173, 227, 1) 0%,
        rgba(87, 111, 230, 1) 25%,
        rgba(152, 68, 183, 1) 51%,
        rgba(255, 53, 127, 1) 100%
      );
      background: -o-linear-gradient(
        45deg,
        rgba(59, 173, 227, 1) 0%,
        rgba(87, 111, 230, 1) 25%,
        rgba(152, 68, 183, 1) 51%,
        rgba(255, 53, 127, 1) 100%
      );
      background: -ms-linear-gradient(
        45deg,
        rgba(59, 173, 227, 1) 0%,
        rgba(87, 111, 230, 1) 25%,
        rgba(152, 68, 183, 1) 51%,
        rgba(255, 53, 127, 1) 100%
      );
      background: linear-gradient(
        45deg,
        rgba(59, 173, 227, 1) 0%,
        rgba(87, 111, 230, 1) 25%,
        rgba(152, 68, 183, 1) 51%,
        rgba(255, 53, 127, 1) 100%
      );
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
      height: 2px;
    }
    :focus {
      outline: none;
    }
    ::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: 2px solid;
      border-radius: 50%;
      width: ${(props) => (props.height ? props.height : '22px')};
      height: ${(props) => (props.height ? props.height : '22px')};
      max-width: 80px;
      position: relative;
      bottom: 11px;
      background-color: #1d1c25;
      // TODO: 높이 간격 조정 필요

      -webkit-transition: border 1000ms ease;
      transition: border 1000ms ease;
    }
    ::-webkit-slider-thumb {
      // blue
      border-color: rgb(59, 173, 227);
    }

    ::-webkit-slider-thumb {
      // ltpurple
      border-color: rgb(87, 111, 230);
    }

    ::-webkit-slider-thumb {
      // purple
      border-color: rgb(152, 68, 183);
    }

    ::-webkit-slider-thumb {
      // pink
      border-color: rgb(255, 53, 127);
    }
    ::-webkit-slider-thumb:active {
      cursor: -webkit-grabbing;
    }

    // TODO: Add Mozila
    /* ::-moz-range-track {
    -moz-appearance: none;
    background: rgba(59, 173, 227, 1);
    background: -moz-linear-gradient(
      45deg,
      rgba(59, 173, 227, 1) 0%,
      rgba(87, 111, 230, 1) 25%,
      rgba(152, 68, 183, 1) 51%,
      rgba(255, 53, 127, 1) 100%
    );
    background: -webkit-gradient(
      left bottom,
      right top,
      color-stop(0%, rgba(59, 173, 227, 1)),
      color-stop(25%, rgba(87, 111, 230, 1)),
      color-stop(51%, rgba(152, 68, 183, 1)),
      color-stop(100%, rgba(255, 53, 127, 1))
    );
    background: -webkit-linear-gradient(
      45deg,
      rgba(59, 173, 227, 1) 0%,
      rgba(87, 111, 230, 1) 25%,
      rgba(152, 68, 183, 1) 51%,
      rgba(255, 53, 127, 1) 100%
    );
    background: -o-linear-gradient(
      45deg,
      rgba(59, 173, 227, 1) 0%,
      rgba(87, 111, 230, 1) 25%,
      rgba(152, 68, 183, 1) 51%,
      rgba(255, 53, 127, 1) 100%
    );
    background: -ms-linear-gradient(
      45deg,
      rgba(59, 173, 227, 1) 0%,
      rgba(87, 111, 230, 1) 25%,
      rgba(152, 68, 183, 1) 51%,
      rgba(255, 53, 127, 1) 100%
    );
    background: linear-gradient(
      45deg,
      rgba(59, 173, 227, 1) 0%,
      rgba(87, 111, 230, 1) 25%,
      rgba(152, 68, 183, 1) 51%,
      rgba(255, 53, 127, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
    height: 2px;
  }

  ::-moz-range-thumb {
    -moz-appearance: none;
    border: 2px solid;
    border-radius: 50%;
    height: 25px;
    width: 25px;
    max-width: 80px;
    position: relative;
    bottom: 11px;
    background-color: #1d1c25;
    cursor: -moz-grab;
    -moz-transition: border 1000ms ease;
    transition: border 1000ms ease;
  } */
  }
`;

const StyledValueRange = styled.datalist`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  transform: translateX(0.1rem);
  color: white;

  & option:first-child {
    min-width: 5.5rem;
    margin-top: 0.2rem;
    border: 1px solid white;
    border-radius: 5px;
    line-height: 1.7rem;
  }
`;

export default RangeBar;
