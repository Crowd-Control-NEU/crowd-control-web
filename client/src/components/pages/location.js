import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Location extends Component {
  state = {
    count: 0,
    name: this.props.match.params.name[0].toUpperCase() + this.props.match.params.name.slice(1),
    endpoint: 'http://localhost:5000'
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ count: res[0].count }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/count/' + this.state.name);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    const socket = socketIOClient(this.state.endpoint);

    socket.on('refresh', newCount => {
      this.setState({ count: newCount });
    });

    return (
      <div className="container">
        <h1>{this.state.name}</h1>
        <h3>{this.state.count}</h3>
      </div>
    );
  }
}

export default Location;
