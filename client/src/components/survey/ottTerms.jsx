import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
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

  // TODO: Debounce 걸기 Saga에서 처리하면 될 듯
  const handleOttTerms = useCallback(
    (e) => dispatch(ACTIONS[e.target.name](e.target.value)),
    [dispatch, ACTIONS],
  );

  return (
    <StyledOttTermsWrapper>
      <RangeBar
        id="ott--price"
        name="price_opt"
        label="OTT 서비스 희망 가격"
        min="0"
        max="15000"
        step="1000"
        width="50%"
        height="24px"
        fontSize="1.5rem"
        colorType="stylish"
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
        width="50%"
        height="24px"
        fontSize="1.5rem"
        colorType="stylish"
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
        width="50%"
        height="24px"
        fontSize="1.5rem"
        colorType="stylish"
        defaultValue={ottFreeTime}
        onChange={handleOttTerms}
      />
    </StyledOttTermsWrapper>
  );
};

const StyledOttTermsWrapper = styled.div`
  width: 100vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export default OttTerms;
