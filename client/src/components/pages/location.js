import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryTheme } from 'victory';

class Location extends Component {
  state = {
    count: 0,
    historical: [],
    graphData: [],
    name: this.capitalize(this.props.match.params.name),
    endpoint: 'http://localhost:5000'
  };

  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({
          count: res[0].count,
          historical: res[0].historical,
          graphData: this.formatGraphData(res[0].historical)
        });
      })
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

  formatGraphData(data) {
    var result = [];
    var count = 0;
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      count += item.count;
      result.push({
        x: i, // item.date
        y: count
      });
    }
    return result;
  }

  render() {
    const socket = socketIOClient();

    socket.on('refresh', newCount => {
      this.setState({ count: newCount });
    });

    return (
      <div className="container">
        <h1>{this.state.name}</h1>
        <h3>{this.state.count}</h3>
        <VictoryChart
          theme={VictoryTheme.material}
          height={200}
        >
          <VictoryAxis
            tickCount={10}
            style={{
              tickLabels: {fontSize: 5}
            }}/>
          <VictoryAxis dependentAxis/>
          <VictoryLine data={this.state.graphData}/>
        </VictoryChart>
      </div>
    );
  }
}

export default Location;
