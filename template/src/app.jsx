import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
} from 'react-router-dom';
import './app.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {() => <div>메인</div>}
        </Route>
        <Route path="/survey">{() => <div>조사</div>}</Route>
        <Route path="/result">{() => <div>결과</div>}</Route>
        <Route path="*">{/* 404 Not Found! */}</Route>
      </Switch>
    </Router>
  );
}

export default App;
