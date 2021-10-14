import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { actions, selector } from '../../store/modules';
import RadioBtn from '../common/radioBtn';

const UserInfo = () => {
  const dispatch = useDispatch();
  const userAge = useSelector(selector.getUserAge);
  const userGender = useSelector(selector.getUserGender);
  const AGES = useMemo(
    () => [
      { id: 'age--teenager', label: '10대', value: '10' },
      { id: 'age--twenties', label: '20대', value: '20' },
      { id: 'age--thirties', label: '30대', value: '30' },
      { id: 'age--forties', label: '40대', value: '40' },
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
    <StyledUserInfo>
      <StyledField>
        <legend>나이</legend>
        <span>나이</span>
        <StyledOptionWrapper>
          {AGES.map(({ id, label, value }) => (
            <RadioBtn
              key={id}
              id={id}
              name="age_opt"
              label={label}
              value={value}
              defaultChecked={userAge === value}
              onClick={handleUser}
              colorType="orange"
            />
          ))}
        </StyledOptionWrapper>
      </StyledField>
      <StyledField>
        <legend>성별</legend>
        <span>성별</span>
        <StyledOptionWrapper>
          {GENDERS.map(({ id, label, value }) => (
            <RadioBtn
              key={id}
              id={id}
              name="gender_opt"
              label={label}
              value={value}
              defaultChecked={userGender === value}
              onClick={handleUser}
              colorType="blue"
            />
          ))}
        </StyledOptionWrapper>
      </StyledField>
    </StyledUserInfo>
  );
};

const StyledUserInfo = styled.div`
  width: 100vw;
`;

const StyledField = styled.fieldset`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: none;
  font-size: 0;
  & > span {
    margin-left: 20vw;
    margin-right: auto;
    font-size: 1.7rem;
  }
`;

const StyledOptionWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 50%;
  margin: 2.5vh auto 2.5vh 0;
`;

export default UserInfo;
