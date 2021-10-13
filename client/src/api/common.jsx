import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const createApi =
  (baseURL) =>
  (method) =>
  (timeout = 3000) =>
  (url) =>
  async (data) => {
    try {
      const response = await axios({
        baseURL,
        url,
        method,
        headers: { 'Content-Type': 'application/json' },
        params: method === 'get' ? data : {},
        data: method !== 'get' ? data : {},
        timeout,
      });
      if (response.status !== 200) {
        throw new Error(response.status); // TODO: 에러 메시지를 받는게...?
      }
      return response.data; // TODO: data를 떤질지 말지 결정!, 응답으로 컨텐츠를 받아오면 될듯!
    } catch (e) {
      throw new Error(e);
    }
  };

const commonApi = createApi(BASE_URL);
const ottApi = {
  get: commonApi('get')(),
  post: commonApi('post')(),
  patch: commonApi('patch')(),
};
export default ottApi;
