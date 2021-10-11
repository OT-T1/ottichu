import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

// 가짜 데이터
const data = {
  labels: ['2020/01', '2020/06', '2020/12', '2021/01', '2021/06', '2021/12'],
  datasets: [
    {
      label: 'netflix',
      data: [34, 46, 59, 82, 52, 84],
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      label: 'whatcha',
      data: [7, 9, 17, 22, 11, 12],
      fill: false,
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgba(54, 162, 235, 0.2)',
    },
  ],
};

export default function Insight({ clickHandler }) {
  return (
    <StyledSection>
      <p>코로나로 인해 OTT에 대한 관심도가 이렇게 변화되었습니다</p>
      <div>
        <Line data={data} />
      </div>
      <p>start를 눌러 시작해보세요</p>
      <button type="button" onClick={clickHandler}>
        start
      </button>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  background: lightblue;

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
