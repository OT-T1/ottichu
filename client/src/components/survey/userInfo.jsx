import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selector } from '../../store/modules';
import RadioBtn from '../common/radioBtn';

const UserInfo = () => {
  const dispatch = useDispatch();
  const userAge = useSelector(selector.getUserAge);
  const userGender = useSelector(selector.getUserGender);
  const AGES = useMemo(
    () => [
      { id: 'age--teenager', label: '10대 이하', value: '10' },
      { id: 'age--twenties', label: '20대', value: '20' },
      { id: 'age--thirties', label: '30대', value: '30' },
      { id: 'age--forties', label: '40대 이상', value: '40' },
    ],
    [],
  );
  const GENDERS = useMemo(
    () => [
      { id: 'gender--male', label: '남성', value: 'male' },
      { id: 'gender--female', label: '여성', value: 'female' },
    ],
    [],
  );
  const ACTIONS = useMemo(
    () => ({
      age_opt: actions.selectAge,
      gender_opt: actions.selectGender,
    }),
    [],
  );

  const handleUser = useCallback(
    (e) => dispatch(ACTIONS[e.target.name](e.target.value)),
    [dispatch, ACTIONS],
  );

  return (
    <div>
      <fieldset>
        <legend>나이</legend>
        {AGES.map(({ id, label, value }) => (
          <RadioBtn
            key={id}
            id={id}
            name="age_opt"
            label={label}
            value={value}
            defaultChecked={userAge === value}
            onClick={handleUser}
          />
        ))}
      </fieldset>
      <fieldset>
        <legend>성별</legend>
        {GENDERS.map(({ id, label, value }) => (
          <RadioBtn
            key={id}
            id={id}
            name="gender_opt"
            label={label}
            value={value}
            defaultChecked={userGender === value}
            onClick={handleUser}
          />
        ))}
      </fieldset>
    </div>
  );
};

export default UserInfo;
