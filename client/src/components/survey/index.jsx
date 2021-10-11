import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import { useDispatch, useSelector } from 'react-redux';
import StepBar from './stepBar';
import SectionLayout from './sectionLayout';
import UserInfo from './userInfo';
import ContentSection from './content';
import { actions, selector } from '../../store/modules';
import PreferenceType from './preferenceType';
import { handleLeave } from '../../utils';
import OttTerms from './ottTerms';
// import { reducerState } from '../../utils/reducer';

const SurveyPage = () => {
  const dispatch = useDispatch();
  const sectionIndex = useSelector(selector.getSurveySectionIndex);
  const isSurveyCompleted = useSelector(selector.isSurveyCompleted);
  const isBasicInfoSubmit = useSelector(selector.isBasicInfoSubmit);
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
        title: '좋아하는 프로그램 선택 페이지',
        contents: <ContentSection />,
      },
    ],
    [],
  );
  // TODO: TEST 코드 => sage에서 백그라운드로 액션 날리면서 처리하게?
  useEffect(() => {
    console.log('testsetsetset', sectionIndex);
    console.log('ㄴㅇㄹㄴㅇㄹㄴ', isSurveyCompleted);
    const storage = window.localStorage;
    storage.setItem(
      'fyott',
      JSON.stringify({
        section: 1,
        slide: 0,
        age: '10',
        gender: 'male',
        categories: {
          movie: false,
          tvshow: true,
          // kMovie: false,
          // fMovie: false,
          // kDrama: false,
          // fDrama: false,
          // kVariety: false,
          // fVariety: false,
          // kAnimation: false,
          // fAnimation: false,
          // documentary: false,
        },
        directors: {},
        actors: {},
        price: 7000,
        freetime: 100,
        group: 2,
      }),
    );
  }, [isSurveyCompleted, sectionIndex]);

  // Control Section Scroll & Slide
  useEffect(() => {
    window.fullpage_api.setAllowScrolling(isSurveyCompleted, 'down');
    window.fullpage_api.setKeyboardScrolling(isSurveyCompleted, 'down');
    // TODO: Add Control Section Slide
  }, [isSurveyCompleted, sectionIndex]);

  const leaveSection = useCallback(
    (destination) => {
      dispatch(actions.movePage({ section: destination.index, slide: 0 }));
      if (destination.isLast && !isBasicInfoSubmit) {
        // TODO: Add submit action
        console.log('제출!!!!!!!!!!!!!!!!!', isBasicInfoSubmit);
        dispatch(actions.requestSubmitBasic());
      }
    },
    [dispatch, isBasicInfoSubmit],
  );

  const leaveSlide = useCallback((section, destination) => {
    // TODO: 슬라이드 작~~~~업
    console.log(section, destination);
  }, []);

  const handleSubmitChoice = useCallback((e) => {
    e.preventDefault();
    console.log(e.target.value);
  }, []);

  return (
    <main role="main">
      <StepBar anchors={anchors} />
      <form onSubmit={handleSubmitChoice}>
        <ReactFullpage
          // licenseKey=""
          anchors={anchors}
          onLeave={handleLeave('scroll', leaveSection)}
          onSlideLeave={handleLeave('slide', leaveSlide)}
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
      </form>
    </main>
  );
};

export default SurveyPage;
