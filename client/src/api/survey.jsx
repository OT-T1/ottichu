import axios from 'axios';

// const BASE_URL = 'http://127.0.0.1:5000/api';
const BASE_URL = 'http://localhost:5000/api';
const httpClient = axios.create({
  baseURL: BASE_URL,
  // headers: { 'Content-Type': 'application/json' },
  headers: { 'Content-Type': 'text/plain' },
  timeout: 1000,
});

// Define Api Creator
// const requestApi = (url, method) => {
//   if (method === 'get') {
//     return async (params) => {
//       try {
//         const response = await httpClient.get(url, { params });
//         if (response.status !== 200) {
//           throw new Error(response.status);
//         }
//         return response.data;
//       } catch (e) {
//         return e;
//       }
//     };
//   } else if (method === 'post') {
//   }
// };

// // Directors Info API
// const getDirectors = requestApi('/actors-directors', 'get');
// const getActor = requestApi('/actors-directors', 'get');

const submitBasicInfo = async (rawData) => {
  try {
    const response = await httpClient.post('/user-input', rawData);
    if (response.status !== 200) {
      throw new Error(response.status);
    }
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

export const surveyApi = {
  // getDirectors,
  // getActor,
  submitBasicInfo,
};
