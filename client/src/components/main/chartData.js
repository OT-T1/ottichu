import ChartDataLabels from 'chartjs-plugin-datalabels';

// export const commonOption = {
//   plugins: {
//     legend: {
//       labels: {
//         usePointStyle: true,
//       },
//     },
//   },
// };

export const labels = [
  '2019-01',
  '2019-02',
  '2019-03',
  '2019-04',
  '2019-05',
  '2019-06',
  '2019-07',
  '2019-08',
  '2019-09',
  '2019-10',
  '2019-11',
  '2019-12',
  '2020-01',
  '2020-02',
  '2020-03',
  '2020-04',
  '2020-05',
  '2020-06',
  '2020-07',
  '2020-08',
  '2020-09',
  '2020-10',
  '2020-11',
  '2020-12',
  '2021-01',
  '2021-02',
  '2021-03',
  '2021-04',
  '2021-05',
  '2021-06',
  '2021-07',
  '2021-08',
  '2021-09',
];

export const wavveAmount = [
  120669, 147678, 171208, 217255, 166025, 141056, 198111, 143558, 93893, 105692,
  142710, 173908, 113657, 101546, 83940, 72376, 79717, 78411, 196091, 330538,
  227476, 160230, 165500, 148531, 124938, 93229, 162629, 188115, 193713, 302744,
  213015, 250924, 226636,
];

export const coupangAmount = [
  0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 34, 20, 25713,
  13569, 2013, 2163, 2167, 1403, 5910, 1651, 2538, 5743,
];

export const tvingAmount = [
  2695, 3703, 5454, 3422, 5229, 4775, 4253, 10816, 7014, 6074, 3994, 4002, 7646,
  3750, 5202, 8206, 4675, 5242, 10781, 8935, 14707, 11953, 8458, 33247, 53644,
  30507, 81543, 105121, 203566, 157257, 66395, 46546, 85620,
];

export const netflixAmount = [
  184425, 238094, 222278, 167983, 126119, 173652, 186043, 149227, 174570,
  161325, 315079, 290698, 167346, 173651, 239392, 234140, 177114, 126192,
  162374, 212349, 341817, 256422, 139572, 286637, 313322, 242887, 243379,
  152578, 252378, 320016, 257333, 223507, 330096,
];

export const whatchaAmount = [
  24461, 22023, 17453, 12371, 14460, 20187, 27266, 26152, 32872, 11340, 8603,
  20787, 19646, 17878, 44419, 32151, 16384, 20436, 41232, 38482, 72869, 39151,
  37979, 130776, 79908, 64520, 51746, 38445, 60547, 65500, 57829, 77389, 48721,
];

export const coronaAmount = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '11',
  '2920',
  '6855',
  '979',
  '703',
  '1331',
  '1506',
  '5641',
  '3865',
  '2700',
  '7688',
  '26527',
  '17471',
  '11467',
  '13415',
  '18927',
  '18331',
  '16623',
  '41374',
  '53081',
  '59868',
];

export const allData = {
  labels,
  datasets: [
    {
      label: '웨이브',
      data: wavveAmount,
      fill: false,
      borderColor: '#BF616A',
    },
    {
      label: '쿠팡플레이',
      data: coupangAmount,
      fill: false,
      borderColor: '#D08770',
    },
    {
      label: '티빙',
      data: tvingAmount,
      fill: false,
      borderColor: '#EBCB8B',
    },
    {
      label: '넷플릭스',
      data: netflixAmount,
      fill: false,
      borderColor: '#A3BE8C',
    },
    {
      label: '왓챠',
      data: whatchaAmount,
      fill: false,
      borderColor: '#B48EAD',
    },
    {
      type: 'bar', // 💗
      label: '월별 코로나 확진자 수',
      backgroundColor: '#5E81AC',
      data: coronaAmount,
      yAxisID: 'y_sub',
    },
  ],
};

export const netflixData = {
  labels,
  datasets: [
    {
      label: '넷플릭스',
      data: netflixAmount,
      fill: false,
      borderColor: '#A3BE8C',
    },
  ],
};

export const netflixKeywords = [
  '킹덤',
  '킹덤',
  '영화',
  '첫사랑',
  '영화',
  '기묘한 이야기',
  '기묘한 이야기',
  '시즌',
  '시즌',
  '범인은 바로 너',
  '범인은 바로 너',
  '언더그라운드',
  '영화',
  '영화',
  '킹덤',
  '드라마',
  '드라마',
  '드라마',
  '영화',
  '영화',
  'music',
  '블랙핑크',
  '드라마',
  '시즌',
  '시즌',
  '영화',
  '영화',
  '넷플릭스',
  '지구',
  '최영재',
  '코리아',
  '영화',
  '카이',
];

export const netflixOption = {
  legend: {
    display: false,
  },
  showAllTooltips: true,
  plugins: {
    datalabels: {
      font: {
        size: 12,
      },
      backgroundColor: '#161424',
      align: 'top',
      borderRadius: 5,
      formatter(value, context) {
        return netflixKeywords[context.dataIndex];
      },
      color: '#ECEFF4',
      borderWidth: 4,
    },
    legend: {
      labels: {
        color: '#ECEFF4',
        usePointStyle: true,
        padding: 10,
        font: {
          family: "'Inter', 'serif'",
          lineHeight: 2,
          size: 14,
        },
      },
    },
  },
};

export const wavveData = {
  labels,
  datasets: [
    {
      label: '웨이브',
      data: wavveAmount,
      fill: false,
      borderColor: '#BF616A',
    },
  ],
};

export const wavveKeywords = [
  '강동호',
  '민혁',
  '팬사인회',
  'bts',
  'nct',
  '보조개',
  '백현',
  '팬사인회',
  '뮤직',
  '정세운',
  '팬싸',
  '김남준',
  '안무',
  '기자',
  '넷플릭스',
  '갓세븐',
  '영상',
  '컵',
  '프로젝트',
  '캠프',
  '토피아',
  '세븐틴',
  '팬싸',
  '어바웃타임',
  '루카스',
  'wayv',
  '크래비티',
  '민호',
  'nct',
  '팬싸',
  '세븐틴',
  '럭키',
  '스트레이',
];

export const wavveOption = {
  legend: {
    display: false,
  },
  showAllTooltips: true,
  plugins: {
    datalabels: {
      font: {
        size: 12,
      },
      backgroundColor: '#161424',
      align: 'top',
      borderRadius: 5,
      formatter(value, context) {
        return wavveKeywords[context.dataIndex];
      },
      color: '#ECEFF4',
      borderWidth: 4,
    },
    legend: {
      labels: {
        color: '#ECEFF4',
        usePointStyle: true,
        padding: 10,
        font: {
          family: "'Inter', 'serif'",
          lineHeight: 2,
          size: 14,
        },
      },
    },
  },
};

export const coupangData = {
  labels,
  datasets: [
    {
      label: '쿠팡플레이',
      data: coupangAmount,
      fill: false,
      borderColor: '#D08770',
    },
  ],
};

export const coupangKeywords = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '쿠팡',
  '아마존',
  '쿠팡',
  '쿠팡',
  '쿠팡',
  '쿠팡',
  '쿠팡',
  '쿠팡',
  '쿠팡',
  '쿠팡',
  '쿠팡',
  '쿠팡',
];

export const coupangOption = {
  legend: {
    display: false,
  },
  showAllTooltips: true,
  plugins: {
    datalabels: {
      font: {
        size: 12,
      },
      backgroundColor: '#161424',
      align: 'top',
      borderRadius: 5,
      formatter(value, context) {
        return coupangKeywords[context.dataIndex];
      },
      color: '#ECEFF4',
      borderWidth: 4,
    },
    legend: {
      labels: {
        color: '#ECEFF4',
        usePointStyle: true,
        padding: 10,
        font: {
          family: "'Inter', 'serif'",
          lineHeight: 2,
          size: 14,
        },
      },
    },
  },
};

export const tvingData = {
  labels,
  datasets: [
    {
      label: '티빙',
      data: tvingAmount,
      fill: false,
      borderColor: '#EBCB8B',
    },
  ],
};

export const tvingKeywords = [
  '무료',
  '티비',
  'kbs',
  'tvn',
  '드라마',
  '무료',
  '드라마',
  'tvn',
  '무료',
  '아이돌룸',
  '넷플릭스',
  '웨이브',
  'tv',
  '웨이브',
  '웨이브',
  '드라마',
  '웨이브',
  '웨이브',
  '시청',
  '웨이브',
  '넷플릭스',
  '유튜브',
  '유튜브',
  '추리',
  '추리',
  '추리',
  '추리',
  '아이돌',
  '아이돌',
  '아이돌',
  '연애',
  '웨이브',
  'tvn',
];

export const tvingOption = {
  legend: {
    display: false,
  },
  showAllTooltips: true,
  plugins: {
    datalabels: {
      font: {
        size: 12,
      },
      backgroundColor: '#161424',
      align: 'top',
      borderRadius: 5,
      formatter(value, context) {
        return tvingKeywords[context.dataIndex];
      },
      color: '#ECEFF4',
      borderWidth: 4,
    },
    legend: {
      labels: {
        color: '#ECEFF4',
        usePointStyle: true,
        padding: 10,
        font: {
          family: "'Inter', 'serif'",
          lineHeight: 2,
          size: 14,
        },
      },
    },
  },
};

export const whatchaData = {
  labels,
  datasets: [
    {
      label: '왓챠',
      data: whatchaAmount,
      fill: false,
      borderColor: '#B48EAD',
    },
  ],
};

export const whatchaKeywords = [
  '영화',
  '넷플릭스',
  '영화',
  '영화',
  '영화',
  '킬링',
  '넷플릭스',
  '영화',
  '넷플릭스',
  '영화',
  '영화',
  '인생',
  '영화',
  '영화',
  '무료',
  '넷플릭스',
  '영화',
  '영화',
  '영화',
  '영화',
  '무료',
  '영화',
  '해리',
  '해리',
  '넷플릭스',
  '넷플릭스',
  '영화',
  '웨이브',
  '드라마',
  '영화',
  '넷플릭스',
  '넷플릭스',
  '넷플릭스',
];

export const whatchaOption = {
  legend: {
    display: false,
  },
  showAllTooltips: true,
  plugins: {
    datalabels: {
      font: {
        size: 12,
      },
      backgroundColor: '#161424',
      align: 'top',
      borderRadius: 5,
      formatter(value, context) {
        return whatchaKeywords[context.dataIndex];
      },
      color: '#ECEFF4',
      borderWidth: 4,
    },
    legend: {
      labels: {
        color: '#ECEFF4',
        usePointStyle: true,
        padding: 10,
        font: {
          family: "'Inter', 'serif'",
          lineHeight: 2,
          size: 14,
        },
      },
    },
  },
};

export const plugins = [ChartDataLabels];
