import React, { useEffect } from 'react';
import styled from 'styled-components';

const Ott = ({ ottName }) => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <StyledDiv>
      {Object.keys(ottName).map((col) => (
        <div>
          {col}:{ottName[col]}
        </div>
      ))}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  border: 1px solid black;
`;

export default Ott;
