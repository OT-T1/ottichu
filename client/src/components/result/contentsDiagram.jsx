import React from 'react';
import { VennDiagram } from 'reaviz';

export default function ContentsDiagram() {
  return (
    <div>
      <h3>취향에 맞는 컨텐츠가 이런 곳에 있어요 😍</h3>
      <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}>
        <VennDiagram
          height={450}
          width={450}
          data={[
            { key: ['netflix'], data: 12 },
            { key: ['coupang play'], data: 12 },
            { key: ['whatcha'], data: 12 },
            { key: ['netflix', 'coupang play'], data: 2 },
            { key: ['coupang play', 'whatcha'], data: 2 },
            { key: ['netflix', 'whatcha'], data: 5 },
            { key: ['netflix', 'coupang play', 'whatcha'], data: 10 },
          ]}
        />
      </div>
    </div>
  );
}
