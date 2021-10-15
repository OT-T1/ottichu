import React, { useEffect } from 'react';
import styled from 'styled-components';

const Ott = ({ ottData }) => {
  useEffect(() => {
    console.log('eslint 방지');
  }, [ottData]);

  return (
    <StyledDiv>
      <p>{ottData.plan}플랜</p>
      <p>월{ottData.price}원</p>
      <p>{ottData.quality}지원</p>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 200ms ease-in;
  opacity: 0;
  color: white;

  p {
    margin: 0;
    margin-top: 1.6em;
    font-family: 'Pretendard';
    font-size: 1.4rem;
  }

  :hover {
    opacity: 0.8;
    background: #0000008d;
  }
`;

export default Ott;
