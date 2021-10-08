import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selector } from '../../store/modules';
import CheckBox from '../common/checkBox';
import SearchBar from '../common/searchBar';

const PreferenceType = () => {
  const dispatch = useDispatch();
  const selectedCategories = useSelector(selector.getSelectedCategories);
  const CATEGORY_TYPES = useMemo(
    () => [
      { id: 'ctgry--movie', type: 'movie', label: '영화' },
      { id: 'ctgry--tvshow', type: 'tvshow', label: 'TV 프로그램' },
      // { id: 'ctgry--kMovie', type: 'kMovie', label: '국내 영화' },
      // { id: 'ctgry--fMovie', type: 'fMovie', label: '해외 영화' },
      // { id: 'ctgry--kDrama', type: 'kDrama', label: '국내 드라마' },
      // { id: 'ctgry--fDrama', type: 'fDrama', label: '해외 드라마' },
      // { id: 'ctgry--kVariety', type: 'kVariety', label: '국내 예능' },
      // { id: 'ctgry--fVariety', type: 'fVariety', label: '해외 예능' },
      // { id: 'ctgry--kAnimation', type: 'kAnimation', label: '국내 애니메이션' },
      // { id: 'ctgry--fAnimation', type: 'fAnimation', label: '해외 애니메이션' },
      // { id: 'ctgry--documentary', type: 'documentary', label: '다큐멘터리' },
    ],
    [],
  );

  const ACTIONS = useMemo(
    () => ({
      director_search: actions.loadDirectors,
      actor_search: actions.loadActors,
    }),
    [],
  );

  const handleContent = useCallback(
    (e) => {
      console.log(e.target.value); // TEST
      dispatch(actions.selectCategories(e.target.value));
    },
    [dispatch],
  );

  const handleActorDirector = useCallback(
    (e) => {
      // TODO: Add filter?

      dispatch(ACTIONS[e.target.name](e.target.value));
    },
    [dispatch, ACTIONS],
  );

  return (
    <div>
      <fieldset>
        <legend>자주보는 카테고리</legend>
        {CATEGORY_TYPES.map(({ id, label, type }) => (
          <CheckBox
            key={id}
            id={id}
            label={label}
            value={type}
            defaultChecked={!!selectedCategories[type]}
            onClick={handleContent}
          />
        ))}
      </fieldset>
      <SearchBar
        id="director"
        name="director_search"
        label="좋아하는 감독"
        notice="감독 이름을 한글로 입력하세요."
        // options={} // TODO: Add data[id]
        onKeyUp={handleActorDirector}
      />
      <SearchBar
        id="actor"
        name="actor_search"
        label="좋아하는 배우"
        notice="배우 이름을 한글로 입력하세요."
        // options={} // TODO: Add data[id]
        onKeyUp={handleActorDirector}
      />
    </div>
  );
};

export default PreferenceType;
