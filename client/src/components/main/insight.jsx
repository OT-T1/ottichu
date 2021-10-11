import React from 'react';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styled from 'styled-components';

const labels = [
  '2019-01',
  '2019-02',
  '2019-03',
  '2019-04',
  '2019-05',
  '2019-06',
  '2019-07',
  '2019-08',
  '2019-09',
  '2019-10',
  '2019-11',
  '2019-12',
  '2020-01',
  '2020-02',
  '2020-03',
  '2020-04',
  '2020-05',
  '2020-06',
  '2020-07',
  '2020-08',
  '2020-09',
  '2020-10',
  '2020-11',
  '2020-12',
  '2021-01',
  '2021-02',
  '2021-03',
  '2021-04',
  '2021-05',
  '2021-06',
  '2021-07',
  '2021-08',
  '2021-09',
];

const wavveAmount = [
  120669, 147678, 171208, 217255, 166025, 141056, 198111, 143558, 93893, 105692,
  142710, 173908, 113657, 101546, 83940, 72376, 79717, 78411, 196091, 330538,
  227476, 160230, 165500, 148531, 124938, 93229, 162629, 188115, 193713, 302744,
  213015, 250924, 226636,
];

const coupangAmount = [
  0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 34, 20, 25713,
  13569, 2013, 2163, 2167, 1403, 5910, 1651, 2538, 5743,
];

const tvingAmount = [
  2695, 3703, 5454, 3422, 5229, 4775, 4253, 10816, 7014, 6074, 3994, 4002, 7646,
  3750, 5202, 8206, 4675, 5242, 10781, 8935, 14707, 11953, 8458, 33247, 53644,
  30507, 81543, 105121, 203566, 157257, 66395, 46546, 85620,
];

const netflixAmount = [
  184425, 238094, 222278, 167983, 126119, 173652, 186043, 149227, 174570,
  161325, 315079, 290698, 167346, 173651, 239392, 234140, 177114, 126192,
  162374, 212349, 341817, 256422, 139572, 286637, 313322, 242887, 243379,
  152578, 252378, 320016, 257333, 223507, 330096,
];

const whatchaAmount = [
  24461, 22023, 17453, 12371, 14460, 20187, 27266, 26152, 32872, 11340, 8603,
  20787, 19646, 17878, 44419, 32151, 16384, 20436, 41232, 38482, 72869, 39151,
  37979, 130776, 79908, 64520, 51746, 38445, 60547, 65500, 57829, 77389, 48721,
];

const allData = {
  labels,
  datasets: [
    {
      label: '웨이브',
      data: wavveAmount,
      fill: false,
      borderColor: '#BF616A',
    },
    {
      label: '쿠팡플레이',
      data: coupangAmount,
      fill: false,
      borderColor: '#D08770',
    },
    {
      label: '티빙',
      data: tvingAmount,
      fill: false,
      borderColor: '#EBCB8B',
    },
    {
      label: '넷플릭스',
      data: netflixAmount,
      fill: false,
      borderColor: '#A3BE8C',
    },
    {
      label: '왓챠',
      data: whatchaAmount,
      fill: false,
      borderColor: '#B48EAD',
    },
  ],
};

const netflixKeyword = {
  labels,
  datasets: [
    {
      label: '넷플릭스',
      data: netflixAmount,
      fill: false,
      borderColor: '#A3BE8C',
    },
  ],
};

const netflixOption = {
  legend: {
    display: false,
  },
  showAllTooltips: true,
};

const plugins = [ChartDataLabels];

export default function Insight({ clickHandler }) {
  return (
    <StyledSection>
      <div>
        <Line data={allData} width={800} height={400} />
      </div>
      <div>
        <Line
          data={netflixKeyword}
          options={netflixOption}
          plugins={plugins}
          width={800}
          height={400}
        />
      </div>
      <StyledDescription>start를 눌러 시작해보세요</StyledDescription>
      <StartBtn type="button" onClick={clickHandler}>
        start
      </StartBtn>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  background: #0f0c1d;

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledDescription = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  text-align: center;

  color: #fffdfd;
`;

const StartBtn = styled.button`
  display: inline;
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 65px;
  text-align: center;

  color: #ffffff;
  width: 232px;
  height: 89px;
  background: linear-gradient(88.75deg, #4a4bf8 0.73%, #ec58d4 102.47%);
  border-radius: 50px;
`;
