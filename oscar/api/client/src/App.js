import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

const App = () =>
  <Router>
    <Fragment>
      <Navbar></Navbar>
      <Route exact path="/" component={Landing}></Route>
      <section className="container">
        <Switch>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/Login" component={Login}></Route>
        </Switch>
      </section>
    </Fragment>
  </Router>

export default App;
