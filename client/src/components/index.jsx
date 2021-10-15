import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { actions } from '../store/modules';
import Intro from './main/intro';
import Insight from './main/insight';
import CustomConfirm from './common/customConfirm';
import { handleScrollSlide } from '../utils';

const MainPage = () => {
  const [onConfirm, setOnConfirm] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const prevRecord = useMemo(() => window.localStorage.getItem('ottichu'), []);

  // 모달창 팝업 시 스크롤 이동 차단
  useEffect(
    () => onConfirm && handleScrollSlide(window.fullpage_api)(false),
    [onConfirm],
  );

  const handleStart = useCallback(() => {
    if (prevRecord) {
      setOnConfirm(true);
      return;
    }
    history.push('survey#1');
  }, [history, prevRecord]);

  // 이전 작성 기록 복구
  const handleRestore = useCallback(() => {
    // Check data in local storage
    dispatch(actions.loadPreviousRecord(prevRecord));
    // console.log(history);
    // return;
    history.push('/survey#1');
  }, [dispatch, history, prevRecord]);

  const handleCancel = useCallback(() => {
    window.localStorage.removeItem('ottichu');
    history.push('survey#1');
  }, [history]);

  return (
    <main role="main">
      {onConfirm && (
        <CustomConfirm
          description="이전에 작성하신 기록이 존재합니다.<br/> 이어서 진행하시겠습니까?"
          onProgress={handleRestore}
          onCancel={handleCancel}
        />
      )}
      <ReactFullpage
        anchors={['1', '2']}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="section">
              <Intro handleStart={handleStart} />
            </div>
            <div className="section">
              <Insight handleStart={handleStart} />
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </main>
  );
};

export default MainPage;
