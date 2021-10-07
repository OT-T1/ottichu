import React, { useEffect } from 'react';
import Ott from './ott';

const OttList = ({ expectedData }) => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <div>
      <h4>당신에게 가장 잘 어울리는 OTT플랫폼은?</h4>
      {Object.keys(expectedData.platform).map((ottName) => (
        <div>
          <div>ott이름: {ottName}</div>
          <Ott ottName={expectedData.platform[ottName]} key={Date.now()} />
        </div>
      ))}
    </div>
  );
};

export default OttList;
