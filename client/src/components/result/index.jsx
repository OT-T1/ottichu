import React, { useEffect } from 'react';
import ContentsDiagram from './contentsDiagram';
import OttList from './ottList';
import PreferenceChart from './preferenceChart';

// TODO: state에 넣을 것
const expectedData = {
  category: {
    korea_movie: 70,
    japan_ani: 20,
    america_drama: 10,
  },
  worldcloud: {},
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

const ResultPage = () => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <div>
      <h2>Result Page</h2>
      <PreferenceChart categories={expectedData.category} />
      <OttList expectedData={expectedData} />
      <ContentsDiagram />
    </div>
  );
};

export default ResultPage;
