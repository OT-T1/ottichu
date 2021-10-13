import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { actions, selector } from '../../store/modules';
import { handleScrollSlide } from '../../utils';
import CheckBox from '../common/checkBox';
import AutoComplete from './autoComplete';

const PreferenceType = ({ fullpageApi }) => {
  const dispatch = useDispatch();
  const selectedCategories = useSelector(selector.getSelectedCategories);
  const validDirectors = useSelector(selector.getValidDirectors);
  const validActors = useSelector(selector.getValidActors);
  // const selectedActors = useSelector(selector.getSelectedActors);
  // const selectedDirecors = useSelector(selector.getSelectedDirectors);
  const isPreferenceAnswered = useSelector(selector.isPreferenceAnswered);
  const CATEGORY_TYPES = useMemo(
    () => [
      { id: 'ctgry--movie', type: 'movie', label: '영화' },
      { id: 'ctgry--tvshow', type: 'tvshow', label: 'TV 프로그램' },
    ],
    [],
  );

  const ACTIONS = useMemo(
    () => ({
      directors: actions.reqDirectors,
      actors: actions.reqActors,
    }),
    [],
  );

  const handleContent = useCallback(
    (e) => dispatch(actions.selectCategories(e.target.value)),
    [dispatch],
  );

  const handleChangeAD = useCallback(
    ({ type, name }) => dispatch(ACTIONS[type](name)),
    [dispatch, ACTIONS],
  );

  const handleSelectAD = useCallback(
    ({ type, name }) => {
      dispatch(actions.selectActorDirector({ type, name }));
    },
    [dispatch],
  );

  const handleFocus = useCallback(() => {
    handleScrollSlide(fullpageApi)(false, 'up, down');
  }, [fullpageApi]);

  const handleBlurAD = useCallback(
    (type) => {
      handleScrollSlide(fullpageApi)(true, 'up');
      handleScrollSlide(fullpageApi)(isPreferenceAnswered, 'down');
      dispatch(actions.clearActorsDirectors({ type }));
    },
    [dispatch, fullpageApi, isPreferenceAnswered],
  );

  return (
    <StyledPreference>
      <StyledCategories>
        <legend>즐겨보는 카테고리</legend>
        <span>
          즐겨보는
          <br />
          카테고리
        </span>
        <StyledCheckBoxWrapper>
          {CATEGORY_TYPES.map(({ id, label, type }) => (
            <CheckBox
              key={id}
              id={id}
              label={label}
              value={type}
              defaultChecked={!!selectedCategories[type]}
              onClick={handleContent}
              colorType="orange"
            />
          ))}
        </StyledCheckBoxWrapper>
      </StyledCategories>
      <StyledAutoCompleteWrapper>
        <span>
          좋아하는 <br /> 감독 및 프로듀서
        </span>
        <StyledAutoComplete>
          <AutoComplete
            name="directors"
            label="좋아하는 감독"
            text="감독 이름을 한글로 입력하세요."
            loading={validDirectors.loading}
            options={validDirectors.data} // TODO: Add data[id]
            onChange={handleChangeAD}
            onSelect={handleSelectAD}
            onFocus={handleFocus}
            onBlur={handleBlurAD}
            colorType="basic"
          />
        </StyledAutoComplete>
      </StyledAutoCompleteWrapper>
      <StyledAutoCompleteWrapper>
        <span>
          좋아하는 <br /> 배우 및 출연진
        </span>
        <StyledAutoComplete>
          <AutoComplete
            name="actors"
            label="좋아하는 배우"
            text="배우 이름을 한글로 입력하세요."
            loading={validActors.loading} // TODO: Add data[id]
            options={validActors.data} // TODO: Add data[id]
            onChange={handleChangeAD}
            onSelect={handleSelectAD}
            onFocus={handleFocus}
            onBlur={handleBlurAD}
            colorType="basic"
          />
        </StyledAutoComplete>
      </StyledAutoCompleteWrapper>
    </StyledPreference>
  );
};

const StyledPreference = styled.div`
  width: 100vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const StyledCategories = styled.fieldset`
  width: 80%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: none;
  font-size: 0;
  & > span {
    font-size: 1.7rem;
    line-height: 2.2rem;
  }
`;

const StyledCheckBoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 40%;
`;

const StyledAutoCompleteWrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  & > span {
    font-size: 1.7rem;
    line-height: 2.2rem;
    margin-right: 3vw;
  }
`;

const StyledAutoComplete = styled.div`
  width: 40%;
  margin-right: 3vw;
`;

export default PreferenceType;

// 임시 Stay
// { id: 'ctgry--kMovie', type: 'kMovie', label: '국내 영화' },
// { id: 'ctgry--fMovie', type: 'fMovie', label: '해외 영화' },
// { id: 'ctgry--kDrama', type: 'kDrama', label: '국내 드라마' },
// { id: 'ctgry--fDrama', type: 'fDrama', label: '해외 드라마' },
// { id: 'ctgry--kVariety', type: 'kVariety', label: '국내 예능' },
// { id: 'ctgry--fVariety', type: 'fVariety', label: '해외 예능' },
// { id: 'ctgry--kAnimation', type: 'kAnimation', label: '국내 애니메이션' },
// { id: 'ctgry--fAnimation', type: 'fAnimation', label: '해외 애니메이션' },
// { id: 'ctgry--documentary', type: 'documentary', label: '다큐멘터리' },
