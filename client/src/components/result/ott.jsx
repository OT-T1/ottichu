import React, { useEffect } from 'react';
import styled from 'styled-components';

const Ott = ({ ottData }) => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
    console.log(`💩 ${ottData.plan}`);
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
  border: 1px solid black;
  padding: 8px 8px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 200ms ease-in;
  transform: translateY(10px);
  opacity: 0;
  color: red;

  :hover {
    opacity: 0.8;
    transform: translateY(0px);
  }
`;

export default Ott;
