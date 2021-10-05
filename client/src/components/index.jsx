import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactFullpage from '@fullpage/react-fullpage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

// 가짜 데이터
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset of Months',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
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
    history.replace('/survey');
  };

  return (
    <div>
      <nav>navbar도 만들어야될듯</nav>
      <ReactFullpage
        anchors={['1', '2']}
        render={() => (
          <ReactFullpage.Wrapper>
            <fieldset className="section">
              <StyledSection>
                <h1>Find your OTT RIGHT NOW!! 🎉</h1>
                <p>ott 방랑자들에게,, start를 눌러보세요</p>
                <button type="button" onClick={clickHandler}>
                  start
                </button>
                <FontAwesomeIcon
                  className="scroll-down"
                  size="2x"
                  icon={faChevronDown}
                />
              </StyledSection>
            </fieldset>
            <fieldset className="section">
              <StyledSection>
                <Line data={data} />
                <p>start를 누르거나 스크롤을 내려봐요</p>
                <button type="button" onClick={clickHandler}>
                  start
                </button>
              </StyledSection>
            </fieldset>
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
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
