import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VennDiagram } from 'reaviz';

const ContentsDiagram = ({ data }) => {
  const [newData, setNewData] = useState({});

  useEffect(() => {
    console.log('e');
    console.log(`💩 ${data}`);
    const tempData = [];

    Object.keys(data).map((item) =>
      tempData.push({
        key: item.split('&'),
        data: data[item],
      }),
    );

    tempData.sort((a, b) => {
      if (a.key.length > b.key.length) {
        return 1;
      }
      if (a.key.length < b.key.length) {
        return -1;
      }
      return 0;
    });

    setNewData(tempData);

    return () => {
      console.log('s');
    };
  }, [data]);

  console.log(newData);
  console.log([
    { key: ['netflix'], data: 12 },
    { key: ['coupang play'], data: 12 },
    { key: ['whatcha'], data: 12 },
    { key: ['netflix', 'coupang play'], data: 2 },
    { key: ['coupang play', 'whatcha'], data: 2 },
    { key: ['netflix', 'whatcha'], data: 5 },
    { key: ['netflix', 'coupang play', 'whatcha'], data: 10 },
  ]);

  return (
    <>
      <h3>취향에 맞는 컨텐츠가 이런 곳에 있어요 😍</h3>
      <StyledDiv>
        <VennDiagram height={450} width={450} data={newData} />
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
