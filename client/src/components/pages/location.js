import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Location extends Component {
  state = {
    count: 0,
    name: this.capitalize(this.props.match.params.name),
    endpoint: 'http://localhost:5000'
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ count: res[0].count }))
      .catch(err => console.log(err));
  }

  capitalize(name) {
    var parts = name.split(" ");
    var result = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      result.push(part[0].toUpperCase() + part.slice(1));
    }
    return result.join(" ");
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
