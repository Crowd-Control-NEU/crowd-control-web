import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// components
import Header from './components/header/header';
import HomePage from './components/pages/home';
import AboutPage from './components/pages/about';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />

          <Route exact path='/' component={HomePage} />
          <Route exact path='/About' component={AboutPage} />
        </div>
      </Router>
    );
  }
}

export default App;
