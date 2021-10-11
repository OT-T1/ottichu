import React, { useEffect } from 'react';
import styled from 'styled-components';
import { VennDiagram } from 'reaviz';

const ContentsDiagram = () => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <>
      <h3>취향에 맞는 컨텐츠가 이런 곳에 있어요 😍</h3>

      <StyledDiv>
        {/* <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}> */}
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
        {/* </div> */}
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
  border: 1px solid red;
  width: 80%;

  margin: auto;
`;

export default ContentsDiagram;
