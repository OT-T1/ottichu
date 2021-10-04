# FrontEnd: Development Guide

### 🏗 디렉토리 구조

src  
|--- api  
|--- components  
|　　|--- main  
|　　|--- survey  
|　　|--- result  
|--- constants  
|--- store  
|　　|--- reducer  
|　　|　　|--- main  
|　　|　　|--- survey  
|　　|　　|--- result  
|　　|--- middleware  
|　　 　　|--- saga etc.  
|--- utils

</br>

### 📒 각 디렉토리별 기능 구현 가이드

디렉토리 바로 아래 존재하는 index.jsx 파일은 해당 디렉토리 내에서 세분화되어 있는 각 기능들을 통합하거나 해당 파트의 메인 기능을 구현하는 용도

1. **api** - api와 관련된 기능들을 구현합니다.
2. **components** - 해당 어플리케이션에 사용하는 컴포넌트들을 구현합니다.
   - common - 전체 어플리케이션에서 공통적으로 사용하는 컴포넌트들을 구현합니다.
   - main - 메인 페이지에서 사용하는 컴포넌트들을 구현합니다.
   - survey - 조사 페이지에서 사용하는 컴포넌트들을 구현합니다.
   - result - 결과 페이지에서 사용하는 컴포넌트들을 구현합니다.
3. **constants** - 전체 어플리케이션에서 사용하는 상수들을 정의합니다.
4. **store** - 전체 어플리케이션에서 사용하는 Reducer 기능들을 구현합니다.
   - index.jsx - store만을 정의합니다.(store 디렉토리 바로 아래에 위치한 파일)
   - reducer - Reducer와 관련된 기능들을 구현합니다.(Actions, Reducers, Selectors)
   - middleware - Thunk나 Saga 등 Middle Ware 사용 시 Middle Ware에 대한 기능들을 구현합니다.
5. **utils** - 전체 어플리케이션에서 사용하는 Utility 기능들을 구현합니다.

### 📖 Reducer 소스 파일 가이드

일단 Ducks 패턴을 생각하고 있는데, Redux 패턴은 상의해보면 좋을 것 같습니다.  
아직 제대로 Ducks 패턴을 읽어보지는 못했지만, 일단 생각한 구조를 예를 들어 설명드리면

사용자 정보에 대한 Reducer인 userReducer를 개발한다고 가정하면 store 디렉토리 내에 위치한 reducer 디렉토리에 user라는 디렉토리를 생성한 후 index.jsx파일을 만들고 다음과 같은 형식에 따라 개발하면 될 것 같습니다.

```javascript
  import 정의부
  // Actions 정의부
  // Reducer 정의부
  // Selectors 정의부
  export 정의부
```

Actions 정의부의 경우 redux-toolkit의 createSlice를 이용할 예정이라 별도로 정의부가 없을 것 같습니다.
