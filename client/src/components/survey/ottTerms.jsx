import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selector } from '../../store/modules';
import RangeBar from '../common/rangeBar';

const OttTerms = () => {
  const dispatch = useDispatch();
  const ottPrice = useSelector(selector.getOttPrice);
  const ottGroupCnt = useSelector(selector.getOttGroupCnt);
  const ottFreeTime = useSelector(selector.getOttFreeTime);

  const ACTIONS = useMemo(
    () => ({
      price_opt: actions.selectOttPrice,
      group_opt: actions.selectOttGroupCnt,
      freetime_opt: actions.selectOttFreeTime,
    }),
    [],
  );

  const handleOttTerms = useCallback(
    (e) => dispatch(ACTIONS[e.target.name](e.target.value)),
    [dispatch, ACTIONS],
  );

  return (
    <div>
      <RangeBar
        id="ott--price"
        name="price_opt"
        label="OTT 서비스 희망 가격"
        min="0"
        max="15000"
        step="1000"
        defaultValue={ottPrice}
        onChange={handleOttTerms}
      />
      <RangeBar
        id="ott--group"
        name="group_opt"
        label="OTT 서비스 이용 인원"
        min="1"
        max="4"
        step="1"
        defaultValue={ottGroupCnt}
        onChange={handleOttTerms}
      />
      <RangeBar
        id="ott--freetime"
        name="freetime_opt"
        label="여가 시간"
        min="0"
        max="180"
        step="10"
        defaultValue={ottFreeTime}
        onChange={handleOttTerms}
      />
    </div>
  );
};

export default OttTerms;
