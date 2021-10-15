import React, { useState } from 'react';
import styled from 'styled-components';
import WavveGraph from './wavveGraph';
import SearchGraph from './searchGraph';
import CoupangGraph from './coupangGraph';
import TvingGraph from './tvingGraph';
import NetflixGraph from './netflixGraph';
import WhatchaGraph from './whatchaGraph';

export default function Insight({ handleStart }) {
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
      <TabWrapper>
        <StyledTab>{tabContentsList.map((chart) => chart.tabTitle)}</StyledTab>
        {tabContentsList[activeTab].tabContent}
      </TabWrapper>
      <StyledDescription>
        <HighlightedText>OTT별 검색 횟수</HighlightedText>와 각 OTT의{' '}
        <HighlightedText>연관검색어 1위</HighlightedText>를 확인해보실 수
        있습니다! <br />
        사용자들의 니즈가 다른 걸 볼 수 있죠?
      </StyledDescription>
      <StartBtn type="button" onClick={handleStart}>
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

  position: relative;

  font-family: 'Pretendard';
`;

const StyledDescription = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 1.1em;
  line-height: 28px;
  text-align: center;

  color: #fffdfd;
`;

const HighlightedText = styled.span`
  color: #514cf7;
  font-weight: bold;
`;

const StartBtn = styled.button`
  display: inline;
  font-style: normal;
  font-weight: bold;
  font-size: 2.2rem;
  text-align: center;

  cursor: pointer;

  color: #ffffff;
  width: 10rem;
  height: 4rem;
  background: linear-gradient(88.75deg, #4a4bf8 0.73%, #ec58d4 102.47%);
  border-radius: 50em;
  border: 1px solid #2e3440;

  transition: transform 250ms ease-in-out;

  :hover {
    transform: scale(1.1);
    background: transparent;
    border: 4px solid #e810b9;
  }
`;

const TabWrapper = styled.div`
  position: relative;
`;

const StyledTab = styled.ul`
  list-style: none;
  width: 80%;
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  position: relative;

  & > li:first-child {
    margin-right: 0.5em;
  }

  & > li + li {
    margin-right: 0.5em;
  }

  li {
    display: flex;
    position: relative;
    justify-content: center;

    transition: transform 200ms ease-in;

    ::before {
      content: '';
      display: inline-block;
      width: 80%;
      height: 1px;
      margin: auto;
      background: linear-gradient(88.75deg, #4a4bf8 0.73%, #ec58d4 102.47%);

      position: absolute;
      bottom: 0;
    }

    button {
      cursor: pointer;
      color: white;

      padding: 0.2em 0.8em;

      background: transparent;
      outline: 0;
      border: none;
      opacity: 0.7;

      :hover {
        background: transparent;
        border-color: white;
        opacity: 1;
      }
    }

    :hover {
      transform: scale(1.1);
    }
  }
`;
