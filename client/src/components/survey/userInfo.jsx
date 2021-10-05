import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreator, selector } from '../../store/modules';
import RadioBtn from '../common/radioBtn';

const UserInfo = () => {
  const dispatch = useDispatch();
  const userAge = useSelector(selector.getUserAge);
  const userGender = useSelector(selector.getGender);

  const saveAge = useCallback(
    (e) => dispatch(actionCreator.saveAge(e.target.value)),
    [dispatch],
  );
  const saveGender = useCallback(
    (e) => dispatch(actionCreator.saveGender(e.target.value)),
    [dispatch],
  );

  return (
    <div>
      <fieldset>
        <legend>나이</legend>
        <RadioBtn
          id="teenager"
          name="age"
          value="10"
          defaultChecked={userAge === '10'}
          text="10대 이하"
          onClick={saveAge}
        />
        <RadioBtn
          id="twenties"
          name="age"
          value="20"
          defaultChecked={userAge === '20'}
          text="20대"
          onClick={saveAge}
        />
        <RadioBtn
          id="thirties"
          name="age"
          value="30"
          defaultChecked={userAge === '30'}
          text="30대"
          onClick={saveAge}
        />
        <RadioBtn
          id="forties"
          name="age"
          value="40"
          defaultChecked={userAge === '40'}
          text="40대 이상"
          onClick={saveAge}
        />
      </fieldset>
      <fieldset>
        <legend>성별</legend>
        <RadioBtn
          id="male"
          name="gender"
          value="male"
          defaultChecked={userGender === 'male'}
          text="남성"
          onClick={saveGender}
        />
        <RadioBtn
          id="female"
          name="gender"
          value="female"
          defaultChecked={userGender === 'female'}
          text="여성"
          onClick={saveGender}
        />
      </fieldset>
    </div>
  );
};

export default UserInfo;
