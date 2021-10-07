import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactFullpage from '@fullpage/react-fullpage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

// 가짜 데이터
const data = {
  labels: ['2020/01', '2020/06', '2020/12', '2021/01', '2021/06', '2021/12'],
  datasets: [
    {
      label: 'netflix',
      data: [34, 46, 59, 82, 52, 84],
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      label: 'whatcha',
      data: [7, 9, 17, 22, 11, 12],
      fill: false,
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgba(54, 162, 235, 0.2)',
    },
  ],
};

const MainPage = () => {
  const history = useHistory();

  const scrollDownHander = () => {
    console.log('scroll');
  };

  useEffect(() => {
    // 스크롤 이벤트 추가
    window.addEventListener('scroll', scrollDownHander);
    return () => {
      // 스크롤 이벤트 삭제
      window.removeEventListener('scroll', scrollDownHander);
    };
  }, []);

  const clickHandler = () => {
    history.replace('/survey#1');
  };

  return (
    <main role="main">
      <nav>navbar도 만들어야될듯</nav>
      <ReactFullpage
        anchors={['1', '2']}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="section">
              <StyledSection>
                <h1>Find your OTT RIGHT NOW!! 🎉</h1>
                <p>수많은 OTT플랫폼 중 어떤걸 쓸지 고민되시나요?</p>
                <p>
                  당신의 취향에 맞는 컨텐츠를 볼 수 있는 OTT플랫폼을
                  추천해드려요 😍
                </p>
                <button type="button" onClick={clickHandler}>
                  start
                </button>
                <FontAwesomeIcon
                  className="scroll-down"
                  size="2x"
                  icon={faChevronDown}
                />
              </StyledSection>
            </div>
            <div className="section">
              <StyledSection>
                <p>코로나로 인해 OTT에 대한 관심도가 이렇게 변화되었습니다</p>
                <div>
                  <Line data={data} />
                </div>
                <p>start를 눌러 시작해보세요</p>
                <button type="button" onClick={clickHandler}>
                  start
                </button>
              </StyledSection>
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </main>
  );
};

const StyledSection = styled.section`
  background: lightblue;

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default MainPage;
