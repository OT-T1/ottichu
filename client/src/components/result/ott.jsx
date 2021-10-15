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
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 20em;
  height: 12em;
  transition: all 200ms ease-in;
  transform: translateY(10px);
  opacity: 0;
  color: white;
  line-height: 1.4em;

  p {
    margin: 0;
    margin-top: 1.8em;
    font-family: 'Pretendard';
  }

  :hover {
    opacity: 0.8;
    background: #0000008d;
    transform: translateY(0px);
  }
`;

export default Ott;
