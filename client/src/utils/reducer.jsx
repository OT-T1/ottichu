// 쓸 수도 있으니... 일단 stay
export const reducerState = Object.freeze({
  // 초기화 State
  initial: (data = null) => ({
    loading: false,
    data,
    error: null,
  }),
  // 로딩 중 State
  loading: (data = null) => ({
    loading: true,
    data,
    error: null,
  }),
  // 성공 State
  success: (data) => ({
    loading: false,
    data,
    error: null,
  }),
  // 실패 State
  failure: (error) => ({
    loading: false,
    data: null,
    error,
  }),
});

// TODO: 만들까말까 모르겠네에에
// export const handleAsyncActions = () => {}
