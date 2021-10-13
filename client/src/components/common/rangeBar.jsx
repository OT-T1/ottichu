import React, { useMemo } from 'react';
import styled from 'styled-components';

const RangeBar = ({
  id,
  name,
  label,
  min,
  max,
  step,
  width,
  height,
  colorType,
  fontSize,
  defaultValue,
  onChange,
}) => {
  const trackSize = useMemo(() => {
    const unit = /[a-z%]+/.exec(height)[0];
    const size = Number(height.replace(/[a-z%]/gi, ''));
    return `${size / 5}${unit}`;
  }, [height]);

  // TODO: 포팅해야댐.
  // const handleMouseDown = useCallback((e) => {}, [unlockStartHandler]);
  // const handleMouseStart = useCallback((e) => {}, [unlockStartHandler]);
  // const handleMouseUp = useCallback((e) => {}, [unlockEndHandler]);
  // const handleTouchEnd = useCallback((e) => {}, [unlockEndHandler]);

  return (
    <StyledRangeBar
      htmlFor={id}
      width={width}
      height={height}
      trackSize={trackSize}
      fontSize={fontSize}
      colorType={colorType}
    >
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
        list={`${id}--tickmarks`}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseStart}
        // onMouseUp={handleMouseUp}
        // onTouchEnd={handleMouseEnd}
      />
      <datalist id={`${id}--tickmarks`}>
        <Test value={min} label={min} />
        <Test value={max} label={max} />
      </datalist>
    </StyledRangeBar>
  );
};

const Test = styled.option`
  font-size: 100px;
  color: white;
`;

const StyledRangeBar = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${(props) => (props.width ? props.width : '500px')};
  font-size: ${(props) => (props.fontSize ? props.fontSize : '1rem')};

  & > input {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    width: 50%;
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

export default RangeBar;
