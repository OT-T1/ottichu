# 🌌 FrontEnd: Development Guide

### 🏗 디렉토리 구조

src  
　|--- api  
　|--- components  
　|　　|--- common  
　|　　|--- main  
　|　　|--- survey  
　|　　|--- result  
　|--- constants  
　|--- store  
　|　　|--- modules  
　|--- utils

</br>

### 📒 각 디렉토리별 기능 구현 가이드

디렉토리 바로 아래 위치한 index.jsx 파일은 해당 디렉토리 내에서 세분화되어 있는 각 기능들을 통합하거나 해당 파트의 메인 기능을 구현

1. **api** - api와 관련된 기능들을 구현합니다.
2. **components** - 해당 어플리케이션에 사용하는 컴포넌트들을 구현합니다.
   - common - 전체 어플리케이션에서 공통적으로 사용하는 컴포넌트들을 구현합니다.
   - main - 메인 페이지에서 사용하는 컴포넌트들을 구현합니다.
   - survey - 조사 페이지에서 사용하는 컴포넌트들을 구현합니다.
   - result - 결과 페이지에서 사용하는 컴포넌트들을 구현합니다.
3. **constants** - 전체 어플리케이션에서 사용하는 상수들을 정의합니다.
4. **store** - 전체 어플리케이션에서 사용하는 Reducer 기능들을 구현합니다.
   - index.jsx - store만을 정의합니다.(store 디렉토리 바로 아래에 위치한 파일)
   - modules - Reducer 관련 기능들을 구현합니다.  
     (Actions, Reducers, Selectors, Middleware(Thunk, Saga 등))
5. **utils** - 전체 어플리케이션에서 사용하는 Utility 기능들을 구현합니다.

### 📖 Reducer 소스 파일 가이드

일단 Ducks 패턴을 생각하고 있는데, Redux 패턴은 상의해보면 좋을 것 같습니다.  
제가 파악한 Ducks 패턴으로 구조를 만들었습니다. 잘못된 부분이 있으면 수정 부탁드립니다.

일단 생각한 구조를 예를 들어 설명드리면 사용자 정보에 대한 Reducer인 userReducer를 개발한다고 가정하면 store 디렉토리의 modules 디렉토리 내에 userReducer.jsx(파일명은 생각해봅시다)파일을 생성하고 아래와 같은 형식으로 개발하면 됩니다.

```javascript
   import 정의부
   // Action 정의부
   // Reducer 정의부
   // Action Creators 정의부
   // Selectors 정의부, selector는 따로 뺄지 넣을 지 고민 중...
   export 정의부 // export default는 Reducer로 할 것!
```

Action의 경우 redux-toolkit의 createSlice를 이용할 예정이라 별도로 정의할 필요가 없을 것 같습니다.
