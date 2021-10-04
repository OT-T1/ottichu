import React from 'react';
import { useHistory } from 'react-router-dom';

const MainPage = () => {
  const history = useHistory();

  return (
    <div>
      메인 페이지임다
      <button type="button" onClick={() => history.replace('/survey')}>
        start
      </button>
    </div>
  );
};

export default MainPage;
