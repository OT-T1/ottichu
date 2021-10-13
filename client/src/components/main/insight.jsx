import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import * as data from './chartData';

export default function Insight({ clickHandler }) {
  return (
    <StyledSection>
      <div className="slide">
        <ChartWrapper>
          <Line data={data.allData} width={800} height={400} />
        </ChartWrapper>
        <StyledDescription>start를 눌러 시작해보세요</StyledDescription>
        <StartBtn type="button" onClick={clickHandler}>
          start
        </StartBtn>
      </div>
      <div className="slide">
        <h1>Wavve</h1>
        <ChartWrapper>
          <Line
            data={data.wavveData}
            options={data.wavveOption}
            plugins={data.plugins}
          />
        </ChartWrapper>
        <StyledDescription>start를 눌러 시작해보세요</StyledDescription>
        <StartBtn type="button" onClick={clickHandler}>
          start
        </StartBtn>
      </div>
      <div className="slide">
        <h1>Coupang Play</h1>
        <ChartWrapper>
          <Line
            data={data.coupangData}
            options={data.coupangOption}
            plugins={data.plugins}
          />
        </ChartWrapper>
        <StyledDescription>start를 눌러 시작해보세요</StyledDescription>
        <StartBtn type="button" onClick={clickHandler}>
          start
        </StartBtn>
      </div>
      <div className="slide">
        <h1>Tving</h1>
        <ChartWrapper>
          <Line
            data={data.tvingData}
            options={data.tvingOption}
            plugins={data.plugins}
          />
        </ChartWrapper>
        <StyledDescription>start를 눌러 시작해보세요</StyledDescription>
        <StartBtn type="button" onClick={clickHandler}>
          start
        </StartBtn>
      </div>
      <div className="slide">
        <h1>Netflix</h1>
        <ChartWrapper>
          <Line
            data={data.netflixData}
            options={data.netflixOption}
            plugins={data.plugins}
          />
        </ChartWrapper>
        <StyledDescription>start를 눌러 시작해보세요</StyledDescription>
        <StartBtn type="button" onClick={clickHandler}>
          start
        </StartBtn>
      </div>
      <div className="slide">
        <h1>Whatcha</h1>
        <ChartWrapper>
          <Line
            data={data.whatchaData}
            options={data.whatchaOption}
            plugins={data.plugins}
          />
        </ChartWrapper>
        <StyledDescription>start를 눌러 시작해보세요</StyledDescription>
        <StartBtn type="button" onClick={clickHandler}>
          start
        </StartBtn>
      </div>
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

const ChartWrapper = styled.div`
  margin-top: 0px;
  width: 50%;
  height: auto;
  margin: auto;
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
  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 65px;
  text-align: center;

  color: #ffffff;
  width: 232px;
  height: 89px;
  background: linear-gradient(88.75deg, #4a4bf8 0.73%, #ec58d4 102.47%);
  border-radius: 50px;

  text-align: center;
`;
