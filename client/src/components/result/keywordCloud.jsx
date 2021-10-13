import React from 'react';
import WordCloud from 'react-d3-cloud';
import styled from 'styled-components';

const fontSize = (word) => word.value / 30;
const rotate = (word) => (word.value % 90) - 45;

export default function KeywordCloud({ data }) {
  const newData = data.map((item) => ({
    text: item.text,
    value: item.value,
  }));

  return (
    <DataWrapper>
      <h1>워드클라우드 💬</h1>
      <WordCloud
        data={newData}
        fontSize={fontSize}
        rotate={rotate}
        padding={2}
        width={700}
        height={400}
      />
    </DataWrapper>
  );
}

const DataWrapper = styled.div`
  width: 50vw;
  height: auto;
  border: 2px solid red;
`;
