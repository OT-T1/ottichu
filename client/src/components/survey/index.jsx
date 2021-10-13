import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import StepBar from './stepBar';
import SectionLayout from './sectionLayout';
import UserInfo from './userInfo';
import { actions, selector } from '../../store/modules';
import PreferenceType from './preferenceType';
import { handleLeave, handleScrollSlide } from '../../utils';
import OttTerms from './ottTerms';
import FavoriteContent from './favoriteContent';
import StyledBtn from '../common/styledBtn';

const STORE_DELAY = 60000;

const SurveyPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const sectionIndex = useSelector(selector.getSurveySectionIndex);
  const isSectionCompleted = useSelector(selector.isSectionCompleted);
  const hasBasicInfoSubmited = useSelector(selector.hasBasicInfoSubmited);
  const hasContentSubmited = useSelector(selector.hasContentSubmited);
  const anchors = useMemo(() => ['1', '2', '3', '4'], []);
  const SETIONS = useMemo(
    () => [
      {
        id: '69b9fe',
        title: '사용자 정보 선택 페이지',
        contents: <UserInfo />,
      },
      {
        id: '5d6165',
        title: '카테고리 및 감독, 배우 선호도 선택 페이지',
        contents: <PreferenceType />,
      },
      {
        id: 'cf8fa4',
        title: '희망 OTT 조건 선택 페이지',
        contents: <OttTerms />,
      },
      {
        id: '0d1813',
        title: '좋아하는 컨텐츠 선택 페이지',
        contents: <FavoriteContent />,
      },
    ],
    [],
  );

  // 일정 주기로 로컬 스토리지에 작성 정보 저장
  useEffect(() => {
    dispatch(
      actions.registerScheduler(
        setInterval(() => dispatch(actions.storeSurveyRecord()), STORE_DELAY),
      ),
    );
  }, [dispatch]);

  const movePreviousRecord = useCallback(
    (anchor) =>
      anchor !== sectionIndex &&
      window.fullpage_api.moveTo(anchors[sectionIndex]),
    [anchors, sectionIndex],
  );

  // Control Section Scroll
  useEffect(() => {
    handleScrollSlide(window.fullpage_api)(isSectionCompleted, 'down');
  }, [isSectionCompleted]);

  const leaveSection = useCallback(
    (destination) => {
      dispatch(actions.movePage(destination.index));
      if (destination.isLast && !hasBasicInfoSubmited) {
        // TODO: Add submit action
        dispatch(actions.reqSubmitBasic());
      }
    },
    [dispatch, hasBasicInfoSubmited],
  );

  const handleNext = useCallback(() => {
    if (!isSectionCompleted) {
      // TODO: 응답 요청 메시지 출력하도록!
      return;
    }
    dispatch(actions.reqSubmitContent({ result: false }));
  }, [dispatch, isSectionCompleted]);

  const moveResultPage = useCallback(() => {
    if (!hasContentSubmited && !isSectionCompleted) {
      // TODO: 응답 요청 메시지 출력하도록!
      return;
    }
    // TODO: Request result to Api url
    dispatch(actions.reqSubmitContent({ result: true }));
    history.replace('/result');
  }, [history, dispatch, isSectionCompleted, hasContentSubmited]);

  const handleRefresh = useCallback(() => {
    dispatch(actions.reqContentInfo());
  }, [dispatch]);

  return (
    <>
      <StyledHeader hidden={sectionIndex !== SETIONS.length - 1}>
        <RefreshButton type="button" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faRedo} color="white" />
        </RefreshButton>
      </StyledHeader>
      <main role="main">
        <StyledStepBarWrapper>
          <StepBar
            width="25px"
            height="70vh"
            anchors={['#1', '#2', '#3', '#4']}
          />
        </StyledStepBarWrapper>
        <div role="form">
          <ReactFullpage
            // licenseKey=""
            // fixedElements=".testbtn"
            anchors={anchors}
            controlArrows={false}
            afterRender={movePreviousRecord}
            onLeave={handleLeave('scroll', leaveSection)}
            sectionsColor={['#0F0C1D', '#0F0C1D', '#0F0C1D', '#0F0C1D']}
            render={({ state, fullpageApi }) => (
              <ReactFullpage.Wrapper>
                {SETIONS.map(({ id, title, contents }, index) => (
                  <SectionLayout
                    key={id}
                    index={index}
                    title={title}
                    state={state}
                    fullpageApi={fullpageApi}
                    contents={contents}
                  />
                ))}
              </ReactFullpage.Wrapper>
            )}
          />
          <StyledBtnWrapper hidden={sectionIndex !== SETIONS.length - 1}>
            <StyledBtn
              type="button"
              text="Result"
              onClick={moveResultPage}
              colorType="stylish"
            />
            <StyledBtn
              type="button"
              text="Next"
              onClick={handleNext}
              colorType="stylish"
            />
          </StyledBtnWrapper>
        </div>
      </main>
    </>
  );
};

const StyledHeader = styled.header`
  position: fixed;
  text-align: right;
  line-height: 20vh;
  width: 100%;
  height: 20vh;
  z-index: 10;
  animation: 2s ease-in-out normal fadein;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const RefreshButton = styled.button`
  cursor: pointer;
  outline: 0;
  border: 0;
  background: none;
  margin-right: 8vw;
  font-size: 30px;
  :hover {
    transform: scale(1.1);
  }
`;

const StyledStepBarWrapper = styled.aside`
  display: flex;
  align-items: center;
  position: fixed;
  left: 7%;
  width: 25px;
  height: 100%;
  z-index: 1;
`;

const StyledBtnWrapper = styled.div`
  width: 100%;
  height: 20vh;
  text-align: center;
  position: fixed;
  line-height: 20vh;
  bottom: 0;
  animation: 2s ease-in-out normal fadein;
  @keyframes fadein {
    // 임시
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

export default SurveyPage;
