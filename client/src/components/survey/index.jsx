import React, { useCallback, useEffect } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { useDispatch, useSelector } from 'react-redux';
import StepBar from './stepBar';
import SurveySection from './surveySection';
import UserInfo from './userInfo';
import ContentSection from './contents';
import { actionCreator, selector } from '../../store/modules';

const sections = Object.freeze([
  {
    id: '69b9fe',
    title: '사용자 정보 선택 페이지',
    contents: <UserInfo />,
  },
  {
    id: '5d6165',
    title: '좋아하는 컨텐츠 종류 및 감독, 배우 선택 페이지',
    contents: <ContentSection />,
  },
  {
    id: 'cf8fa4',
    title: '희망하는 OTT 조건 선택 페이지',
    contents: <ContentSection />,
  },
  {
    id: '0d1813',
    title: '좋아하는 프로그램 선택 페이지',
    contents: <ContentSection />,
  },
]);

const SurveyPage = () => {
  const dispatch = useDispatch();
  const isSectionCompleted = useSelector(selector.isSectionCompleted);
  const sectionIndex = useSelector(selector.getSectionIndex);

  useEffect(() => {
    // TODO: Load localStorage
    window.fullpage_api.setAllowScrolling(isSectionCompleted, 'down');
    window.fullpage_api.setKeyboardScrolling(isSectionCompleted, 'down');
  }, [isSectionCompleted, sectionIndex]);

  const handleLeave = useCallback(
    (original, destination) => {
      if (original.index === destination.index) {
        return;
      }
      dispatch(actionCreator.updateSection(destination.index));
      if (destination.isLast) {
        console.log('제출!!!!!!!!!!!!!!!!!');
      }
    },
    [dispatch],
  );

  const submitPickedContents = useCallback((e) => {
    e.preventDefault();
    console.log(e.target.value);
  }, []);

  return (
    <main role="main">
      <StepBar pageIndex={[0, 1, 2, 3]} />;
      <form action="" onSubmit={submitPickedContents}>
        <ReactFullpage
          // licenseKey=""
          anchors={['1', '2', '3', '4']}
          onLeave={handleLeave}
          render={({ state, fullpageApi }) => (
            <ReactFullpage.Wrapper>
              {sections.map((section, index) => (
                <SurveySection
                  key={section.id}
                  index={index}
                  title={section.title}
                  state={state}
                  fullpageApi={fullpageApi}
                  contents={section.contents}
                />
              ))}
            </ReactFullpage.Wrapper>
          )}
        />
      </form>
    </main>
  );
};

export default SurveyPage;
