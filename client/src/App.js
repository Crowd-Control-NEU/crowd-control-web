import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// components
import Header from './components/header/header';
import HomePage from './components/pages/home';
import AboutPage from './components/pages/about';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/test');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Route exact path='/' component={HomePage} />
          <Route exact path='/About' component={AboutPage} />
          <p>{this.state.response}</p>
        </div>
      </Router>
    );
  }
}

export default App;