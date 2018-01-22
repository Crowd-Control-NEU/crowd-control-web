import React, { Component } from 'react';

class Location extends Component {
  state = {
    count: 0,
    name: this.props.match.params.name[0].toUpperCase() + this.props.match.params.name.slice(1)
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ count: res[0].sum }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/count/' + this.state.name);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="container">
        <h1>{this.state.name}</h1>
        <h3>{this.state.count}</h3>
      </div>
    );
  }
}

export default Location;
