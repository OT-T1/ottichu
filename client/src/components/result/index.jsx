import React, { useEffect } from 'react';
import OttList from './OttList';

const ResultPage = () => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <div>
      <h2>Result Page</h2>
      <OttList />
    </div>
  );
};

export default ResultPage;
