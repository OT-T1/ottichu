import React from 'react';

const expectedData = {
  category: {
    korea_movie: 70,
    japan_ani: 20,
  },
  result: {
    genre: '호러',
    price: 5000,
  },
  platform: {
    wavve: {
      percentage: 50,
      plan: '프리미엄',
      quality: '4K',
      price: 14500,
      people_number: 4,
    },
    watcha: {
      percentage: 30,
      plan: '프리미엄',
      quality: '4K',
      price: 12900,
      people_number: 4,
    },
    coupang: {
      percentage: 20,
      plan: '와우멤버십',
      quality: '4K',
      price: 2900,
      people_number: 1,
    },
  },
  best_contents: [
    [1, '{title}', '{director}', '{img_url}', '{platform}'],
    [2, '...'],
  ],
};

function Ott({ ottName }) {
  return (
    <div>
      {Object.keys(ottName).map((col) => (
        <div>
          {col}:{ottName[col]}
        </div>
      ))}
    </div>
  );
}

// TODO: change to arrow function
export default function OttList() {
  return (
    <div>
      <h4>OTT List</h4>
      {Object.keys(expectedData.platform).map((ottName) => (
        <div>
          <div>ott이름: {ottName}</div>
          <Ott ottName={expectedData.platform[ottName]} key={Date.now()} />
        </div>
      ))}
    </div>
  );
}
