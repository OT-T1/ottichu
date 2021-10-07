import React, { useEffect } from 'react';

const Ott = ({ ottName }) => {
  // TODO: delete this
  useEffect(() => {
    console.log('eslint 방지용');
  }, []);

  return (
    <div>
      {Object.keys(ottName).map((col) => (
        <div>
          {col}:{ottName[col]}
        </div>
      ))}
    </div>
  );
};

export default Ott;
