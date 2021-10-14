import React, { useEffect } from 'react';
import styled from 'styled-components';
import { VennDiagram } from 'reaviz';

const ContentsDiagram = () => {
  useEffect(() => {
    console.log('e');
    return () => {
      console.log('s');
    };
  }, []);

  return (
    <>
      <h3>취향에 맞는 컨텐츠가 이런 곳에 있어요 😍</h3>
      <StyledDiv>
        <VennDiagram
          height={450}
          width={450}
          data={[
            { key: ['netflix'], data: 12 },
            { key: ['coupang play'], data: 12 },
            { key: ['whatcha'], data: 12 },
            { key: ['netflix', 'coupang play'], data: 2 },
            { key: ['coupang play', 'whatcha'], data: 2 },
            { key: ['netflix', 'whatcha'], data: 5 },
            { key: ['netflix', 'coupang play', 'whatcha'], data: 10 },
          ]}
        />
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
  border: 1px solid red;
  width: 80%;
  text-align: center;
`;

export default ContentsDiagram;
