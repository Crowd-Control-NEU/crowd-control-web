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
      <div className='container'>
        <h1 className='ubuntu title'>CROWD CONTROL</h1>
        <h1 className='ubuntu desc'>All In One - Low Cost - People Counter</h1>
        <p className='ubuntu info'><span>Explore how busy locations are in real time, <br/> or view trends to see how crowded a place is expected to be on certain days and specific hours.</span></p>
        <Map></Map>
      </div>
    );
  }
}

export default Home;
