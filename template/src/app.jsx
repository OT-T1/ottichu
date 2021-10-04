import React from 'react';
import { Provider } from 'react-redux';
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

function App() {
  return (
    <Router>
      <Provider store={store}>
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
      </Provider>
    </Router>
  );
}

export default App;
