import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

export default function Intro({ clickHandler }) {
  return (
    <StyledSection>
      <StyledTitle>Find your OTT Right Now!</StyledTitle>
      <StyledDescription>
        더 이상 어느 OTT를 쓸 지 고민하지마세요. <br />
        오띠츄와 함께 당신의 취향에 맞는 OTT플랫폼을 찾아보세요 😍
      </StyledDescription>
      <div>
        <StartBtn type="button" onClick={clickHandler}>
          start
        </StartBtn>
        <MoreBtn type="button">자세히</MoreBtn>
      </div>
      <FontAwesomeIcon className="scroll-down" size="2x" icon={faChevronDown} />
    </StyledSection>
  );
}

const StyledSection = styled.section`
  background: radial-gradient(
      69.83% 54.69% at 50% 7.13%,
      #1d2442 0%,
      #0f0c1d 100%
    ),
    #594fa9;

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.h1`
  width: 936px;
  height: 332px;

  margin: 0;

  font-family: 'Karla';
  font-style: normal;
  font-weight: bold;
  font-size: 112px;
  line-height: 168px;
  text-align: center;

  color: #ffffff;

  mix-blend-mode: lighten;
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
`;

const MoreBtn = styled.button`
  display: inline;

  width: 232px;
  height: 89px;
  border: 4px solid
      adial-gradient(69.83% 54.69% at 50% 7.13%, #1d2442 0%, #0f0c1d 100%),
    #594fa9;
  border-radius: 50px;

  background: transparent;

  font-family: Open Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 65px;
  text-align: center;

  color: #ffffff;
`;
