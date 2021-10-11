import React, { useCallback, useEffect } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions } from '../store/modules';
import Intro from './main/intro';
import Insight from './main/insight';

const MainPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const scrollDownHander = () => {
    console.log('scroll');
  };

  useEffect(() => {
    // 스크롤 이벤트 추가
    window.addEventListener('scroll', scrollDownHander);
    return () => {
      // 스크롤 이벤트 삭제
      window.removeEventListener('scroll', scrollDownHander);
    };
  }, []);

  const clickHandler = useCallback(() => {
    // Check data in local storage
    const record = window.localStorage.getItem('fyott');
    if (
      record &&
      window.confirm(
        '이전에 작성하신 기록이 존재합니다.\r\n이어서 진행하시겠습니까?',
      )
    ) {
      dispatch(actions.requestLoad(record));
      console.log(history);
      return;
    }

    // TODO: 히스토리 넣어도 여기 왜오니
    console.log('돌아가!!!!!!');
    window.localStorage.removeItem('fyott');
    history.push('/survey#1');
  }, [dispatch, history]);

  return (
    <main role="main">
      <ReactFullpage
        anchors={['1', '2']}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="section">
              <Intro clickHandler={clickHandler} />
            </div>
            <div className="section">
              <Insight clickHandler={clickHandler} />
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </main>
  );
};

export default MainPage;
