import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import * as data from './chartData';

export default function NetflixGraph() {
  return (
    <div>
      <ChartWrapper>
        <Line
          data={data.netflixData}
          options={data.netflixOption}
          plugins={data.plugins}
          width={1000}
          height={400}
        />
      </ChartWrapper>
    </div>
  );
}

const ChartWrapper = styled.div`
  margin-top: 0px;
  height: auto;
  margin: auto;
`;
