import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';

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
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgb(75, 192, 192)'],
        },
      ],
    };

    setData(newData);
  }, [categories]);

  return (
    <div>
      <h3>선호 장르, 카테고리 표</h3>
      <StyledDiv>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </StyledDiv>
    </div>
  );
}

const StyledDiv = styled.div`
  width: 629px;
  height: 289px;
  background: linear-gradient(
    126.6deg,
    rgba(255, 255, 255, 0.12) 28.69%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(140px);
  border-radius: 25px;
  border: 2px solid #ffffff1f;
`;
