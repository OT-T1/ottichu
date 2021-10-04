import React, { useEffect } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';

const SurveyPage = () => {
  useEffect(() => {
    console.log('eslint 방지');
  }, []);

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
        console.log('hi');
      }}
    >
      <ReactFullpage
        // licenseKey=""
        anchors={['1', '2', '3', '4']}
        onLeave={(original, destination, direction) => {
          if (destination.anchor === '4' && direction === 'down') {
            alert('제출!!!!!!!!!!!!!!!!!');
          }
        }}
        render={() => (
          <ReactFullpage.Wrapper>
            <fieldset className="section">
              <legend>1</legend>
            </fieldset>
            <fieldset className="section">
              <legend>2</legend>
            </fieldset>
            <fieldset className="section">
              <legend>3</legend>
            </fieldset>
            <fieldset className="section">
              <legend>4</legend>
            </fieldset>
          </ReactFullpage.Wrapper>
        )}
      />
      <button
        style={{ position: 'fixed', bottom: '100px' }}
        type="submit"
        onClick={() => console.log('결과!!!!!!!')}
      >
        결과
      </button>
    </form>
  );
};

export default SurveyPage;
