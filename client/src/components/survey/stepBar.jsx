import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selector } from '../../store/modules';

const StepBar = ({ anchors }) => {
  const sectionsState = useSelector(selector.getSurveySectionState);

  const tmpColor = useCallback(
    (section, slide) =>
      sectionsState[section][slide] ? 'black' : 'transparent',
    [sectionsState],
  );

  useEffect(() => {
    console.log(sectionsState);
  }, [sectionsState]);

  // TODO: 대애충 임시 확인용 코드
  return (
    <aside
      style={{
        position: 'fixed',
        top: 10,
        left: 10,
      }}
    >
      {anchors &&
        anchors.map((anchor, index) => (
          <div
            key={anchor}
            style={{
              width: 20,
              height: 20,
              background: `${tmpColor(index, 0)}`,
              borderRadius: 50,
            }}
          >
            {anchor}
          </div>
        ))}
    </aside>
  );
};

export default StepBar;
