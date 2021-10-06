import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function PreferenceChart({ categories }) {
  // store에서 할 애들임 지금 임시임
  const labels = [];
  const percent = [];

  Object.keys(categories).map((category) => labels.push(category));
  Object.keys(categories).map((category) => percent.push(categories[category]));

  const data = {
    labels,
    datasets: [
      {
        borderWidth: 1,
        data: percent,
      },
    ],
  };

  const options = {
    legend: {
      display: true, // label 보이기 여부
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0, // y축 스케일에 대한 최소값 설정
            stepSize: 1, // y축 그리드 한 칸당 수치
          },
        },
      ],
    },

    maintainAspectRatio: false,
  };

  return (
    <div>
      <h4>선호 장르, 카테고리 표</h4>
      <div>
        <Bar data={data} options={options} height={300} />
      </div>
      {Object.keys(categories).map((category) => (
        <div>
          {category}:{categories[category]}
        </div>
      ))}
    </div>
  );
}
