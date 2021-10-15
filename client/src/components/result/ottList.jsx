import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Ott from './ott';

const OttList = ({ result }) => {
  const [ottData, setOttData] = useState([]);

  useEffect(() => {
    const newData = [];

    Object.keys(result.platform).map((ottName) =>
      newData.push({
        name: ottName,
        ...result.platform[ottName],
      }),
    );

    newData.sort((a, b) => {
      if (a.percentage < b.percentage) {
        return 1;
      }
      if (a.percentage > b.percentage) {
        return -1;
      }
      return 0;
    });

    setOttData(newData);
  }, [result]);

  return (
    <>
      <StyledTitle>당신에게 가장 잘 어울리는 OTT플랫폼은?</StyledTitle>
      <StyledDiv>
        {ottData.map((ott) => (
          <Wrapper>
            <img src={ott.imgurl} alt="" />
            <Ott ottData={ott} />
          </Wrapper>
        ))}
      </StyledDiv>
    </>
  );
};

const StyledTitle = styled.h3`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: bold;
  font-size: 1.8em;
  text-align: center;
  color: #ffffff;
  transform: matrix(1, 0, 0, 1, 0, 0);
  margin-bottom: 0.6em;
`;

const StyledDiv = styled.div`
  /* border: 1px solid red; */
  width: 80%;
  display: flex;
  justify-content: center;

  img {
    width: 20em;
    height: 12em;
  }

  & > div:first-child {
    margin-right: 0.2em;
  }

  & > div + div {
    margin-right: 0.2em;
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

export default OttList;
