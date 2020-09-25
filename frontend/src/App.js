import React from 'react';
import SignIn from './components/SignIn';
import Drawer from './components/Drawer';
import './assets/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/test">Test</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Switch>
        <Route path="/test">
          <Drawer></Drawer>
        </Route>
        <Route path="/">
          <SignIn />
        </Route>
      </Switch>
      <div>
      </div>
    </Router>
  );
}
