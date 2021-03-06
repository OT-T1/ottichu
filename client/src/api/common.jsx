import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const createApi =
  (baseURL) =>
  (method) =>
  (timeout = 10000) =>
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
      const normal = /^2[0-9]{2}$/;
      if (!normal.test(response.status)) {
        throw new Error(response.status); // TODO: 에러 메시지를 받는게...?
      }
      return response.data;
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
