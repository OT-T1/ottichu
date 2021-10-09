import React, { useEffect } from 'react';
import styled from 'styled-components';

const Ott = ({ ottName }) => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <StyledDiv>
      <p>월{ottName.price / ottName.people_number}원</p>
      <p>{ottName.plan}플랜</p>
      <p>{ottName.quality}지원</p>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  border: 1px solid black;
  padding: 8px 8px;
  text-align: center;
`;

export default Ott;
