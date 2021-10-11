import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

export default function Intro({ clickHandler }) {
  return (
    <StyledSection>
      <h1>Find your OTT RIGHT NOW!! 🎉</h1>
      <p>수많은 OTT플랫폼 중 어떤걸 쓸지 고민되시나요?</p>
      <p>당신의 취향에 맞는 컨텐츠를 볼 수 있는 OTT플랫폼을 추천해드려요 😍</p>
      <button type="button" onClick={clickHandler}>
        start
      </button>
      <FontAwesomeIcon className="scroll-down" size="2x" icon={faChevronDown} />
    </StyledSection>
  );
}

const StyledSection = styled.section`
  background: lightblue;

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
