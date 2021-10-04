import React from 'react';
import { useHistory } from 'react-router-dom';
import ReactFullpage from '@fullpage/react-fullpage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const MainPage = () => {
  const history = useHistory();

  const clickHandler = () => {
    history.replace('/survey');
  };

  return (
    <div>
      <nav>navbar도 만들어야될듯</nav>
      <ReactFullpage
        anchors={['1', '2', '3']}
        // TODO: change
        onLeave={(original, destination, direction) => {
          if (destination.anchor === '3' && direction === 'down') {
            alert('여긴 메인');
          }
        }}
        render={() => (
          <ReactFullpage.Wrapper>
            <fieldset className="section">
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
            </fieldset>
            <fieldset className="section">
              <div>Chart가 올 자리</div>
              <p>start를 누르거나 스크롤을 내려봐요</p>
              <button type="button" onClick={clickHandler}>
                start
              </button>
              <FontAwesomeIcon
                className="scroll-down"
                size="2x"
                icon={faChevronDown}
              />
            </fieldset>
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
  );
};

export default MainPage;
