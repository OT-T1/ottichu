import React, { useCallback, useEffect } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions, selector } from '../store/modules';
import Intro from './main/intro';
import Insight from './main/insight';

const MainPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const sectionIndex = useSelector(selector.getSurveySectionIndex);

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
    const record = window.localStorage.getItem('ottichu');
    if (
      record &&
      window.confirm(
        '이전에 작성하신 기록이 존재합니다.\r\n이어서 진행하시겠습니까?',
      )
    ) {
      dispatch(actions.loadPreviousRecord(record));
      // console.log(history);
      // return;
    } else {
      window.localStorage.removeItem('ottichu');
    }

    // TODO: 히스토리 넣어도 여기 왜오니
    history.push(`/survey#${sectionIndex + 1}`);
  }, [dispatch, history, sectionIndex]);

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
