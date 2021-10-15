import React, { useCallback } from 'react';
import styled from 'styled-components';

const CustomAlarm = ({ description, onClose }) => {
  const handleClose = useCallback(
    () => typeof onClose === 'function' && onClose(),

    [onClose],
  );

  return (
    <StyledCustomAlarmWrapper>
      <StyledPopupBox>
        <span>
          {description.split('<br/>').map((line, index) => (
            <span key={`line${index + 1}`}>
              <br />
              {line}
            </span>
          ))}
        </span>
        <StyledButton type="button" onClick={handleClose}>
          확인
        </StyledButton>
      </StyledPopupBox>
    </StyledCustomAlarmWrapper>
  );
};

const StyledCustomAlarmWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 999;
`;

const StyledPopupBox = styled.div`
  width: 35vw;
  height: 25vh;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr;
  position: relative;
  background: #393535;
  opacity: 0.95;
  color: white;
  font-size: 1.1rem;

  & > span:first-child {
    grid-row: 1 / 3;
    grid-column: 1 / 3;
    align-self: center;
    text-align: center;
    padding: 1rem;
  }
`;

const StyledButton = styled.button`
  height: 80%;
  align-self: end;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
  background: #7aadb0;
  cursor: pointer;

  :hover {
    background: white;
    color: black;
  }
`;

export default CustomAlarm;
