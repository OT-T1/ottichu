import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import StepBar from './stepBar';
import SectionLayout from './sectionLayout';
import UserInfo from './userInfo';
import { actions, selector } from '../../store/modules';
import PreferenceType from './preferenceType';
import { handleLeave, handleScrollSlide } from '../../utils';
import OttTerms from './ottTerms';
import FavoriteContent from './favoriteContent';

const SurveyPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selector.getUser);
  const sectionIndex = useSelector(selector.getSurveySectionIndex);
  const isSectionCompleted = useSelector(selector.isSectionCompleted);
  const hasBasicInfoSubmited = useSelector(selector.hasBasicInfoSubmited);
  const isContentAnswered = useSelector(selector.isContentAnswered);
  const anchors = useMemo(() => ['1', '2', '3', '4'], []);
  const lastIndex = useMemo(
    () => (anchors ? anchors.length - 1 : -1),
    [anchors],
  );
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
      if (destination.isLast) {
        if (!hasBasicInfoSubmited) {
          dispatch(actions.reqSubmitBasic());
          return;
        }
        if (!isContentAnswered) {
          dispatch(actions.reqContentInfo({ user }));
        }
      }
    },
    [dispatch, user, hasBasicInfoSubmited, isContentAnswered],
  );

  return (
    <>
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
            normalScrollElements="#directors-option--list, #actors-option--list"
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
        </div>
      </main>
      <StyledFooter
        activate={isSectionCompleted}
        hidden={sectionIndex === lastIndex}
      >
        <FontAwesomeIcon size="2x" icon={faChevronDown} color="white" />
      </StyledFooter>
    </>
  );
};

const StyledStepBarWrapper = styled.aside`
  display: flex;
  align-items: center;
  position: fixed;
  left: 7%;
  width: 25px;
  height: 100%;
  z-index: 1;
`;

const StyledFooter = styled.footer`
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  transform: translateX(50vw);
  height: 15vh;
  bottom: 0;
  text-align: center;
  transition: animation 0.5s ease-in;
  & > svg {
    opacity: 0.5;
  }

  ${(props) =>
    props.activate &&
    css`
      & > svg {
        animation: 1s ease-in infinite alternate highlight_one;
      }

      @keyframes highlight_one {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          opacity: 1;
        }
      }
    `}
`;

export default SurveyPage;
