import React, { useState } from 'react';
import styled from 'styled-components';
import WavveGraph from './wavveGraph';
import SearchGraph from './searchGraph';
import CoupangGraph from './coupangGraph';
import TvingGraph from './tvingGraph';
import NetflixGraph from './netflixGraph';
import WhatchaGraph from './whatchaGraph';

export default function Insight({ clickHandler }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabHandler = (index) => {
    setActiveTab(index);
  };

  const tabContentsList = [
    {
      tabTitle: (
        <li>
          <button type="button" onClick={() => tabHandler(0)}>
            OTT별 검색 수 변화량
          </button>
        </li>
      ),
      tabContent: <SearchGraph />,
    },
    {
      tabTitle: (
        <li>
          <button type="button" onClick={() => tabHandler(1)}>
            웨이브
          </button>
        </li>
      ),
      tabContent: <WavveGraph />,
    },
    {
      tabTitle: (
        <li>
          <button type="button" onClick={() => tabHandler(2)}>
            쿠팡플레이
          </button>
        </li>
      ),
      tabContent: <CoupangGraph />,
    },
    {
      tabTitle: (
        <li>
          <button type="button" onClick={() => tabHandler(3)}>
            티빙
          </button>
        </li>
      ),
      tabContent: <TvingGraph />,
    },
    {
      tabTitle: (
        <li>
          <button type="button" onClick={() => tabHandler(4)}>
            넷플릭스
          </button>
        </li>
      ),
      tabContent: <NetflixGraph />,
    },
    {
      tabTitle: (
        <li>
          <button type="button" onClick={() => tabHandler(5)}>
            왓챠
          </button>
        </li>
      ),
      tabContent: <WhatchaGraph />,
    },
  ];

  return (
    <StyledSection>
      <StyledTab>{tabContentsList.map((chart) => chart.tabTitle)}</StyledTab>
      {tabContentsList[activeTab].tabContent}
      <StyledDescription>코로나 어쩌구 문구가 들어가야될듯</StyledDescription>
      <StartBtn type="button" onClick={clickHandler}>
        Start
      </StartBtn>
    </StyledSection>
  );
}

const StyledSection = styled.section`
  margin: 0;
  background: #0f0c1d;

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledDescription = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  text-align: center;

  color: #fffdfd;
`;

const StartBtn = styled.button`
  display: inline;
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 2.6rem;
  /* line-height: 5rem; */
  text-align: center;

  cursor: pointer;

  color: #ffffff;
  width: 13rem;
  height: 5rem;
  background: linear-gradient(88.75deg, #4a4bf8 0.73%, #ec58d4 102.47%);
  border-radius: 50px;
  border: 1px solid white;

  margin-right: 2rem;
`;

const StyledTab = styled.ul`
  list-style: none;
  background: red;

  li {
    display: inline-block;
  }
`;
