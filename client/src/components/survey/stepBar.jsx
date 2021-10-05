import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selector } from '../../store/modules';

const StepBar = (pageIndex) => {
  const sectionsState = useSelector(selector.getSectionsState);

  const tmpColor = useCallback(
    (index) => (sectionsState[index] ? 'black' : 'transparent'),
    [sectionsState],
  );

  useEffect(() => {
    console.log(sectionsState);
  }, [sectionsState]);

  return (
    <aside
      style={{
        position: 'fixed',
        top: 10,
        left: 10,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          background: `${tmpColor(0)}`,
          borderRadius: 50,
        }}
      >
        {pageIndex[0]}
      </div>
      <div
        style={{
          width: 20,
          height: 20,
          background: `${tmpColor(1)}`,
          borderRadius: 50,
        }}
      >
        {pageIndex[1]}
      </div>
      <div
        style={{
          width: 20,
          height: 20,
          background: `${tmpColor(2)}`,
          borderRadius: 50,
        }}
      >
        {pageIndex[2]}
      </div>
      <div
        style={{
          width: 20,
          height: 20,
          background: `${tmpColor(3)}`,
          borderRadius: 50,
        }}
      >
        {pageIndex[3]}
      </div>
    </aside>
  );
};

export default StepBar;
