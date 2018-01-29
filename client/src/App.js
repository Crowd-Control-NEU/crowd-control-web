import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// components
import Header from './components/header/header';
import Home from './components/pages/home';
import About from './components/pages/about';
import Location from './components/pages/location';
import LocationsList from './components/pages/locationslist';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Route exact path='/' component={Home} />
          <Route exact path='/About' component={About} />
          <Route exact path='/Locations' component={LocationsList} />
          <Route exact path='/Locations/:name' component={Location} />
        </div>
      </Router>
    );
  }
}

export default App;
