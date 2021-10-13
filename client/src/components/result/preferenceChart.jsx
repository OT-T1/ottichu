import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';

export default function PreferenceChart({ categories }) {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const labels = [];
    const percent = [];

    Object.keys(categories).map((category) => labels.push(category));
    Object.keys(categories).map((category) =>
      percent.push(categories[category]),
    );

    const newData = {
      labels,
      datasets: [
        {
          label: '장르 선호도',
          borderWidth: 1,
          data: percent,
          backgroundColor: ['green', 'red', 'blue', 'yellow', 'pink'],
          borderColor: ['rgb(75, 192, 192)'],
        },
      ],
    };

    setData(newData);
  }, [categories]);

  return (
    <TestDiv>
      <h1>선호 장르 표</h1>
      <StyledDiv>
        <Pie data={data} options={{ maintainAspectRatio: false }} />
      </StyledDiv>
    </TestDiv>
  );
}

const StyledDiv = styled.div`
  width: 40vw;
  height: 36vh;
  background: linear-gradient(
    126.6deg,
    rgba(255, 255, 255, 0.12) 28.69%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(140px);
  border-radius: 25px;
  border: 2px solid #ffffff1f;
`;

const TestDiv = styled.div`
  border: 2px solid red;
`;
