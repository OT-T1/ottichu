import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { actions, selector } from '../../store/modules';
import loadingWalk from '../../assets/images/loading_walk.gif';
import ImageCheckBox from '../common/ImageCheckBox';
import StyledBtn from '../common/styledBtn';
import CustomAlarm from '../common/customAlarm';
import { handleScrollSlide } from '../../utils';
import CustomConfirm from '../common/customConfirm';

// MAX COUNT - 1 (0부터 시작해서 현재 페이지를 포함하므로)
const MAX_CONTENT_SUBMIT_COUNT = 4;
const ALARM_MSGS = Object.freeze({
  loading: '컨텐츠를 불러오고 있습니다.<br/> 잠시만 기다려주세요.',
  isNotCompleted:
    '현재 페이지를 완료하지 않았습니다.<br/> 완료 후 다시 시도해주세요.',
  goResult:
    '모든 검사를 완료해야 정확한 추천을 받을 수 있습니다.<br/> 계속 하시겠습니까?',
});

const FavoriteContent = ({ fullpageApi }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(selector.getUser);
  const isContentAnswered = useSelector(selector.isContentAnswered);
  const contentSubmitCnt = useSelector(selector.getContentSubmitCnt);
  const { loading, data: contentList } = useSelector(selector.getContentList);
  const selectionStorage = useSelector(selector.getSelectionStorage);
  const isAlarmActivated = useSelector(selector.isAlarmActivated);
  const isConfirmActivated = useSelector(selector.isConfirmActivated);

  const contentCount = useMemo(
    () => (contentList ? contentList.length : 0),
    [contentList],
  );

  const openPopup = useCallback(
    (action) => {
      handleScrollSlide(fullpageApi)(false);
      dispatch(action);
    },
    [dispatch, fullpageApi],
  );

  const handleCheck = useCallback(
    (e) => dispatch(actions.selectContent(e.target.value)),
    [dispatch],
  );

  const handleNext = useCallback(() => {
    if (!isContentAnswered || loading) {
      openPopup(actions.activateAlarm());
      return;
    }
    dispatch(actions.reqSubmitContent({ result: false }));
  }, [dispatch, openPopup, isContentAnswered, loading]);

  const goResult = useCallback(() => {
    dispatch(actions.clearScheduler());
    dispatch(actions.reqSubmitContent({ result: true }));
    // 현재 로컬 스토리지에 저장된 데이터 삭제
    window.localStorage.removeItem('ottichu');
    history.replace('/result');
  }, [history, dispatch]);

  const handleResult = useCallback(() => {
    if (!contentSubmitCnt && !isContentAnswered) {
      openPopup(actions.activateAlarm());
      return;
    }
    if (contentSubmitCnt < MAX_CONTENT_SUBMIT_COUNT || !isContentAnswered) {
      openPopup(actions.activateConfirm());
      return;
    }
    goResult();
  }, [openPopup, goResult, isContentAnswered, contentSubmitCnt]);

  const handleRefresh = useCallback(() => {
    dispatch(actions.reqContentInfo(user));
  }, [dispatch, user]);

  const closeAlarm = useCallback(
    (action) => () => {
      dispatch(action);
      handleScrollSlide(fullpageApi)(true);
    },
    [dispatch, fullpageApi],
  );

  return (
    <StyledFavoriteContent>
      {isAlarmActivated && (
        <CustomAlarm
          description={loading ? ALARM_MSGS.loading : ALARM_MSGS.isNotCompleted}
          onClose={closeAlarm(actions.closeAlarm())}
        />
      )}
      {isConfirmActivated && (
        <CustomConfirm
          description={ALARM_MSGS.goResult}
          onProgress={goResult}
          onCancel={closeAlarm(actions.closeConfirm())}
        />
      )}
      <StyledSectionTitle>
        {`선호하는 컨텐츠를 선택해주세요. (${contentSubmitCnt}/${
          MAX_CONTENT_SUBMIT_COUNT + 1
        })`}
      </StyledSectionTitle>
      {loading ? (
        <StyledLoadingWrapper>
          <img src={loadingWalk} alt="loading" />
          <span>Loading...</span>
        </StyledLoadingWrapper>
      ) : (
        <StyledContentWrapper count={contentCount}>
          {contentList?.map(([code, title, , url]) => (
            <ImageCheckBox
              key={code}
              id={code}
              name={title}
              url={url}
              value={code}
              defaultChecked={code in selectionStorage}
              onClick={handleCheck}
              // info={director ? director.join('|') : ''}
            />
          ))}
        </StyledContentWrapper>
      )}
      <StyledFooter>
        <RefreshButton type="button" onClick={handleRefresh}>
          Refresh
        </RefreshButton>
        <StyledBtnWrapper>
          <StyledBtn
            type="button"
            text="Result"
            onClick={handleResult}
            colorType="stylish"
          />
          <StyledBtn
            type="button"
            text="Next"
            onClick={handleNext}
            hidden={contentSubmitCnt === MAX_CONTENT_SUBMIT_COUNT}
            colorType="stylish"
          />
        </StyledBtnWrapper>
      </StyledFooter>
    </StyledFavoriteContent>
  );
};

const StyledFavoriteContent = styled.fieldset`
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: none;
`;

const StyledSectionTitle = styled.legend`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  font-size: 1.5rem;
  min-height: 10vh;
`;

const StyledLoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
`;

const StyledContentWrapper = styled.div`
  position: relative;
  bottom: 10vh;
  display: grid;
  align-items: center;

  ${(props) =>
    props.count > 5
      ? css`
          grid-template-rows: repeat(2, 1fr);
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem 1rem;
          width: 47vw;
          @media screen and (max-width: 1280px) {
            width: 60vw;
          }
        `
      : css`
          grid-template-rows: repeat(1, 1fr);
          grid-template-columns: repeat(${props.count}, 1fr);
          gap: 1.5rem 1.5rem;
          width: 30vw;
          @media screen and (max-width: 1280px) {
            width: 30vw;
          }
        `}

  @media screen and (max-width: 780px) {
    grid-template-columns: 1fr;
    top: 5vh;
    width: 50%;
  }
`;

const RefreshButton = styled.button`
  background: none;
  outline: 0;
  border: 0;
  cursor: pointer;
  font-family: 'Shadows Into Light', cursive;
  font-size: 1.5rem;
  color: white;
  transition: all 300ms ease-in;
  margin-bottom: 1.2rem;

  :hover {
    transform: scale(1.1);
  }
`;

const StyledFooter = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 10vh;
`;

const StyledBtnWrapper = styled.div`
  text-align: center;
  animation: 2s ease-in-out normal fadein;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  & > button {
    margin: 0 3vw;
  }
`;

export default FavoriteContent;
