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
          <Wrapper>
            <img src={`/images/${ottName}_logo.png`} alt={`${ottName} logo`} />
            <Ott ottName={result.platform[ottName]} key={ottName} />
          </Wrapper>
        ))}
      </StyledDiv>
    </>
  );
};

const StyledTitle = styled.h3`
  font-family: 'Inter';
  font-style: normal;
  font-weight: bold;
  font-size: 1.8em;
  text-align: center;
  color: #ffffff;
  transform: matrix(1, 0, 0, 1, 0, 0);
  margin-bottom: 0.6em;
`;

const StyledDiv = styled.div`
  /* border: 1px solid red; */
  width: 80%;
  display: flex;
  justify-content: center;

  img {
    width: 20em;
    height: 12em;
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

export default OttList;
