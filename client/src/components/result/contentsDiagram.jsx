import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ChartTooltip,
  // Gradient,
  VennArc,
  VennDiagram,
  VennLabel,
  VennOuterLabel,
  VennSeries,
} from 'reaviz';

const ContentsDiagram = ({ data }) => {
  const [newData, setNewData] = useState({});

  useEffect(() => {
    console.log('e');
    console.log(`π© ${data}`);
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

  return (
    <>
      <h3>μ·¨ν₯μ λ§λ μ»¨νμΈ κ° μ΄λμ λ§μκΉμ? π</h3>
      <StyledDiv>
        <VennDiagram
          type="starEuler"
          height={300}
          width={600}
          data={newData}
          series={
            <VennSeries
              arc={
                <VennArc
                  // gradient={<Gradient />}
                  tooltip={<ChartTooltip color="red" />}
                  // fill="#D08770"
                  strokeWidth={3}
                  // stroke="red"
                />
              }
              label={
                <VennLabel
                  // fill="red"
                  labelType="value"
                  showAll
                  fontSize={20}
                  fontFamily="Karla"
                />
              }
              outerLabel={
                <VennOuterLabel fill="white" fontSize={20} fontFamily="Karla" />
              }
            />
          }
        />
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
  /* border: 1px solid red; */
  /* width: 80%; */
  text-align: center;
  /* padding: 1em 1em; */
  /* margin: 2em; */
  margin-bottom: 2em;
  padding: 2em;
  background: linear-gradient(
    126.6deg,
    rgba(255, 255, 255, 0.12) 28.69%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(140px);
  border-radius: 25px;
  border: 2px solid #ffffff1f;
`;

export default ContentsDiagram;
