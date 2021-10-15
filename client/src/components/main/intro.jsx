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
        오띠츄와 함께 당신의 성향에 맞는 OTT플랫폼을 찾아보세요 😍
      </StyledDescription>
      <div>
        <StartBtn type="button" onClick={clickHandler}>
          Start
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
  width: 8em;
  height: 2.6em;

  margin: 0;
  margin-top: 0.3em;

  font-family: 'Karla';
  font-style: normal;
  font-weight: bold;
  font-size: 7em;
  text-align: center;

  color: #ffffff;

  mix-blend-mode: lighten;
`;

const StyledDescription = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: normal;
  font-size: 1.1rem;
  text-align: center;

  color: #fffdfd;

  margin: 0;
  margin-bottom: 2rem;
`;

const StartBtn = styled.button`
  display: inline;
  font-family: 'Open Sans';
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

  margin-right: 2rem;

  transition: transform 250ms ease-in-out;

  :hover {
    transform: scale(1.1);
    background: transparent;
    border: 4px solid #e810b9;
  }
`;

const MoreBtn = styled.button`
  display: inline;

  width: 10rem;
  height: 4rem;

  border: 4px solid;

  background: linear-gradient(#0f0c1d, #0f0c1d) padding-box,
    linear-gradient(88.75deg, #4a4bf8 0.73%, #ec58d4 102.47%) border-box;
  border-radius: 50em;
  border: 4px solid transparent;

  font-family: 'Open Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 1.6rem;
  text-align: center;

  color: #ffffff;

  transition: transform 250ms ease-in-out;

  :hover {
    transform: scale(1.1);
    background: transparent;
    border: 4px solid #e810b9;
  }
`;

// const StyledArrow = styled(faChevronDown)`
//   background:
// `
