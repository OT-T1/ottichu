// Throttle Function: 일정 주기로 요청(주의: 엘레멘트에 인라인으로 사용!)
export const throttle = (func, delay) => {
  let timerId = null;
  return (...args) => {
    if (!timerId) {
      timerId = setTimeout(() => func.call(this, ...args), delay);
    }
  };
};

// Debounce Function: 연속된 입력에 대한 Debounce(주의: 엘레멘트에 인라인으로 사용!)
export const debounce = (func, delay) => {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.call(this, ...args);
    }, delay);
  };
};

// Control Scroll & Slide of Fullpage
export const handleLeave = (type, func, ...args) =>
  type === 'scroll'
    ? (sectionOrig, sectionDest, scrollDir) => {
        if (sectionOrig.index === sectionDest.index) {
          return;
        }
        func.call(this, ...args, sectionDest, scrollDir);
      }
    : (section, slideOrig, slideDest, slideDir) => {
        if (slideOrig.index === slideDest.index) {
          return;
        }
        func.call(this, ...args, section, slideDest, slideDir);
      };

export const handleScrollSlide = (api) => (activate, direction) => {
  api.setAllowScrolling(activate, direction);
  api.setKeyboardScrolling(activate, direction);
};
