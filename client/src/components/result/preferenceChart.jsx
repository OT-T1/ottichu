import React, { useEffect, useState } from 'react';
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
          borderWidth: 1,
          data: percent,
        },
      ],
    };

    setData(newData);
  }, [categories]);

  return (
    <div>
      <h3>선호 장르, 카테고리 표</h3>
      <div style={{ width: '600px' }}>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </div>
      {Object.keys(categories).map((category) => (
        <div>
          {category}:{categories[category]}
        </div>
      ))}
    </div>
  );
}
