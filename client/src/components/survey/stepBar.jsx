import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selector } from '../../store/modules';

const StepBar = ({ width, height, anchors }) => {
  const sectionsState = useSelector(selector.getSurveySectionState);
  const last = anchors?.length - 1;
  const stepWidth = useMemo(
    () => Number(width.replace(/[a-z%]/gi, '')),
    [width],
  );
  const lineHeight = useMemo(() => {
    if (!last || last < 0) {
      return 0;
    }
    const unit = /[a-z%]+/.exec(height)[0];
    const size = Number(height.replace(/[a-z%]/gi, ''));
    if (unit === '%' || unit === 'vh') {
      return `${size / last - (stepWidth / window.innerHeight) * 100}vh`;
    }
    return `${size / last - stepWidth}px`;
  }, [height, last, stepWidth]);

  return (
    <StyledStepBar width={width} height={height}>
      {anchors &&
        anchors.map((step, index) => (
          <StyledStep
            key={step}
            last={last === index}
            width={stepWidth}
            lineHeight={lineHeight}
            completed={sectionsState[index]}
          />
        ))}
    </StyledStepBar>
  );
};

const StyledStepBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const StyledStep = styled.div`
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.width}px`};
  border-radius: 50%;
  background: white;

  ${(props) =>
    props.completed &&
    css`
      background: hsla(193, 90%, 55%, 1);

      background: linear-gradient(
        135deg,
        hsla(193, 90%, 55%, 1) 0%,
        hsla(280, 95%, 57%, 1) 100%
      );

      background: -moz-linear-gradient(
        135deg,
        hsla(193, 90%, 55%, 1) 0%,
        hsla(280, 95%, 57%, 1) 100%
      );

      background: -webkit-linear-gradient(
        135deg,
        hsla(193, 90%, 55%, 1) 0%,
        hsla(280, 95%, 57%, 1) 100%
      );

      filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#26C5F3", endColorstr="#B429F9", GradientType=1 );
      border: solid 2px #00e1ff;
    `}

  ${(props) =>
    !props.last &&
    css`
      &::before {
        content: '';
        display: block;
        margin: ${`${props.width}px`} auto 0 auto;
        width: 2px;
        height: ${`${props.lineHeight}`};
        background: ${props.completed
          ? 'linear-gradient(#4a4bf8, #ec58d4)'
          : 'white'};
      }
    `}
`;
// ${(props) =>
// props.completed ? 'linear-gradient(#4a4bf8, #ec58d4)' : 'white'}; */
export default StepBar;
