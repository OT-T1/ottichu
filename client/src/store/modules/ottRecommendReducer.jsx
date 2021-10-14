// whatcha: {
//     price: 10000,
//   },
//   netflix: {
//     price: 10000,
//   },
//   coupang: {
//     price: 10000,
//   },
// }

const initialState = {
  // ott 추천 결과
  result: {},
};

// TODO: action 수정
const ottRecommendReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_RESULTS':
      return { ...state };
    default:
      return { ...state };
  }
};

const fetchResults = () => {
  return {
    type: 'FETCH_RESULTS',
  };
};

export default ottRecommendReducer;
