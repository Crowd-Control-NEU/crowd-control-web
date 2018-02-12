import React, { Component } from 'react';
import Button from './../buttons/button';
import socketIOClient from 'socket.io-client';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryTheme } from 'victory';

class Location extends Component {
  state = {
    count: 0,
    graphData: [],
    tickValues: [0, 1, 2, 3, 4, 5, 6],
    tickFormat: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    name: this.capitalize(this.props.match.params.name),
    endpoint: 'http://localhost:5000'
  };

  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({
          count: res[0].count,
          graphData: res[0].graphData,
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

  buttonManager(str){
        if (str === "daily") {
          this.refs.weekly.toggle();
          this.refs.monthly.toggle();
          this.refs.yearly.toggle();
        }

        if (str === "weekly") {
          this.refs.daily.toggle();
          this.refs.monthly.toggle();
          this.refs.yearly.toggle();
        }

        if (str === "monthly") {
          this.refs.daily.toggle();
          this.refs.weekly.toggle();
          this.refs.yearly.toggle();
        }

        if (str === "yearly") {
          this.refs.daily.toggle();
          this.refs.weekly.toggle();
          this.refs.monthly.toggle();
        }
        // TODO call functions that retrieve daily/weekly/montly/yearly data for graph
  }

  render() {
    const socket = socketIOClient();

    socket.on('refresh', newCount => {
      this.setState({ count: newCount });
    });

    return (
      <div className="container">
      <center>
        <h1>{this.state.name}</h1>
        <h1>{this.state.count}</h1>
      </center>
        <VictoryChart theme={VictoryTheme.material} height={200} domainPadding={10}>
          <VictoryAxis
            style={{ tickLabels: {fontSize: 5}}}
            tickValues={ this.state.tickValues }
            tickFormat={ this.state.tickFormat }/>
          <VictoryAxis dependentAxis/>
          <VictoryLine
            data={this.state.graphData}
            interpolation='monotoneX'/>
        </VictoryChart>
        <center>
            <Button ref="daily" text="Daily" update={ () => {this.buttonManager("daily") }}></Button>
            <Button ref="weekly" text="Weekly" update={ () => {this.buttonManager("weekly") }}></Button>
            <Button ref="monthly" text="Monthly" update={ () => {this.buttonManager("monthly") }}></Button>
            <Button ref="yearly" text="Yearly" update={ () => {this.buttonManager("yearly") }}></Button>
        </center>
      </div>
    );
  }
}

export default Location;
