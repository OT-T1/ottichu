import React from 'react';

// TODO: make file
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
export default function OttList({ expectedData }) {
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
}
