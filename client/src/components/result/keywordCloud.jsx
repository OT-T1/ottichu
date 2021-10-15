import React, { useState, useEffect } from 'react';
import WordCloud from 'react-d3-cloud';
import styled from 'styled-components';

const fontSize = (word) => word.value;
const rotate = (word) => ((word.value * 100) % 90) - 45;

export default function KeywordCloud({ data }) {
  const [newData, setNewData] = useState([]);

  useEffect(() => {
    const temp = [];
    data.words.map((word) => temp.push({ text: word[0], value: word[1] }));
    setNewData(temp);
  }, [data.words]);
  console.log(newData);

  return (
    <DataWrapper>
      <h1>워드클라우드</h1>
      <CloudWrapper>
        <WordCloud
          data={newData}
          fontSize={fontSize}
          font="Pretendard"
          rotate={rotate}
          padding={2}
          width={700}
          height={400}
        />
      </CloudWrapper>
    </DataWrapper>
  );
}

const DataWrapper = styled.div`
  width: 50vw;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloudWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
