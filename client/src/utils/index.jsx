export const debouce = (func, delay) => {
  let timerId = null;

  return (args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(args), delay);
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
