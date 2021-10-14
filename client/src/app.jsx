import React from 'react';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { persistStore } from 'redux-persist';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
} from 'react-router-dom';
import './app.css';
import MainPage from './components';
import ResultPage from './components/result';
import SurveyPage from './components/survey';
import store from './store';
// import history from './utils/history';

// const persistor = persistStore(store);

function App() {
  return (
    // <Router history={history}>
    <Router>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/survey">
            <SurveyPage />
          </Route>
          <Route path="/result">
            <ResultPage />
          </Route>
          <Route path="*">{/* 404 Not Found! */}</Route>
        </Switch>
        {/* </PersistGate> */}
      </Provider>
    </Router>
  );
}

export default App;
