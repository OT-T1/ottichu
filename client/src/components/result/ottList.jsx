import React, { useEffect } from 'react';
import styled from 'styled-components';
import Ott from './ott';

const OttList = ({ result }) => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <>
      <StyledTitle>당신에게 가장 잘 어울리는 OTT플랫폼은?</StyledTitle>
      <StyledDiv>
        {Object.keys(result.platform).map((ottName) => (
          <div>
            <img src={`/images/${ottName}_logo.png`} alt={`${ottName} logo`} />
            <Ott ottName={result.platform[ottName]} key={Date.now()} />
          </div>
        ))}
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
  border: 1px solid red;
  width: 80%;
  display: flex;
  justify-content: center;

  img {
    width: 300px;
    height: 180px;
  }
`;

const StyledTitle = styled.h3`
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 42px;
  text-align: center;
  color: #ffffff;
  transform: matrix(1, 0, 0, 1, 0, 0);
`;

export default OttList;
