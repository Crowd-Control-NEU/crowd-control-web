import React, { Component } from 'react';
import Map from './../map/map';

class Home extends Component {
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
      <div className="container">
        <h1>Crowd Control Home Page</h1>
        <p>{this.state.response}</p>
        <Map></Map>
      </div>
    );
  }
}

export default Home;
