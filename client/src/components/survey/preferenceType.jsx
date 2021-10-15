import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { actions, selector } from '../../store/modules';
import { handleScrollSlide } from '../../utils';
import CheckBox from '../common/checkBox';
import AutoComplete from './autoComplete';

// const MAX_SELECT_COUNT = 5;

const PreferenceType = ({ fullpageApi }) => {
  const dispatch = useDispatch();
  const selectedCategories = useSelector(selector.getSelectedCategories);
  const validDirectors = useSelector(selector.getValidDirectors);
  const validActors = useSelector(selector.getValidActors);
  const selectedActors = useSelector(selector.getSelectedActors);
  const selectedDirectors = useSelector(selector.getSelectedDirectors);
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

  const handleDeleteAD = useCallback(
    (e) => {
      dispatch(
        actions.deleteActorDirector({
          type: e.target.dataset.type,
          name: e.target.dataset.name,
        }),
      );
    },
    [dispatch],
  );

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
      <StyledFieldName>
        <li>
          즐겨보는
          <br />
          카테고리
        </li>
        <li>
          좋아하는 <br /> 감독 및 제작자
        </li>
        <li>
          좋아하는 <br /> 배우 및 출연진
        </li>
      </StyledFieldName>
      <StyledControlBox>
        <StyledCategories>
          <legend>즐겨보는 카테고리</legend>
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
          <StyledAutoComplete>
            <AutoComplete
              name="directors"
              label="좋아하는 감독"
              text="감독 이름을 한글로 입력하세요."
              loading={validDirectors.loading}
              options={validDirectors.data} // TODO: Add data[id]
              onChange={handleChangeAD}
              onSelect={handleSelectAD}
              onBlur={handleBlurAD}
              colorType="basic"
            />
          </StyledAutoComplete>
          <StyledSelectedListWrapper onClick={handleDeleteAD}>
            {selectedDirectors &&
              selectedDirectors.map((director) => (
                <li
                  key={director}
                  name={director}
                  data-type="directors"
                  data-name={director}
                >
                  {`${director} `}
                  <FontAwesomeIcon icon={faTimesCircle} />
                </li>
              ))}
          </StyledSelectedListWrapper>
        </StyledAutoCompleteWrapper>
        <StyledAutoCompleteWrapper>
          <StyledAutoComplete>
            <AutoComplete
              name="actors"
              label="좋아하는 배우"
              text="배우 이름을 한글로 입력하세요."
              loading={validActors.loading} // TODO: Add data[id]
              options={validActors.data} // TODO: Add data[id]
              onChange={handleChangeAD}
              onSelect={handleSelectAD}
              // onFocus={handleFocus}
              onBlur={handleBlurAD}
              colorType="basic"
            />
          </StyledAutoComplete>
          <StyledSelectedListWrapper onClick={handleDeleteAD}>
            {selectedActors &&
              selectedActors.map((actor) => (
                <li
                  key={actor}
                  name={actor}
                  data-type="actors"
                  data-name={actor}
                >
                  {`${actor} `}
                  <FontAwesomeIcon icon={faTimesCircle} />
                </li>
              ))}
          </StyledSelectedListWrapper>
        </StyledAutoCompleteWrapper>
      </StyledControlBox>
    </StyledPreference>
  );
};

const StyledPreference = styled.div`
  width: 100vw;
  height: 70vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 10vw;
`;

const StyledFieldName = styled.ul`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  list-style: none;
  font-size: 1.5rem;
  margin-right: 15vw;
`;

const StyledControlBox = styled.div`
  max-width: 25vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const StyledCategories = styled.fieldset`
  min-width: 25vw;
  border: none;
  font-size: 0;
`;

const StyledCheckBoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

// 임시 보관
const StyledAutoCompleteWrapper = styled.div``;
const StyledAutoComplete = styled.div``;

const StyledSelectedListWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: justify;
  font-size: 1rem;
  & > li {
    display: inline-block;
    background: #a0a0a060;
    border-radius: 10px;
    padding: 0.3rem 0.8rem;
    margin-top: 0.7rem;
    cursor: pointer;
    opacity: 0.7;

    & > svg {
      pointer-events: none;
    }

    :hover {
      opacity: 1;
    }
  }
  & > li + li {
    margin-left: 0.5rem;
  }
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

// const StyledCategories = styled.fieldset`
//   width: 70%;
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   border: none;
//   font-size: 0;
//   & > span {
//     font-size: 1.7rem;
//     line-height: 2.2rem;
//   }
// `;

// const StyledCheckBoxWrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 40%;
// `;

// const StyledAutoCompleteWrapper = styled.div`
//   width: 70%;
//   display: flex;
//   justify-content: space-around;
//   align-items: flex-start;
//   & > span {
//     font-size: 1.7rem;
//     line-height: 2.2rem;
//     margin-right: 3vw;
//   }
// `;

// const StyledAutoComplete = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 40%;
//   margin-right: 3vw;
//   margin-top: 0.9rem;
// `;

// const StyledSelectedListWrapper = styled.ul`
//   list-style: none;
//   width: 110%;
//   /* border: 1px solid white; */
//   /* min-height: 7rem; */
//   margin: 0;
//   padding: 0;
//   text-align: justify;
//   font-size: 1.2rem;
//   & > li {
//     display: inline-block;
//     background: #a0a0a060;
//     border-radius: 10px;
//     padding: 0.3rem 0.8rem;
//     margin-top: 0.7rem;
//     cursor: pointer;
//     opacity: 0.7;

//     :hover {
//       opacity: 1;
//     }
//   }
//   & > li + li {
//     margin-left: 0.5rem;
//   }
// `;
