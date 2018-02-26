import React, { Component } from 'react';
import Button from './../buttons/button';
import socketIOClient from 'socket.io-client';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryTheme } from 'victory';
import DatePicker from 'react-date-picker';

class Location extends Component {
  state = {
    count: 0,
    graphData: [],
    tickValues: [0, 1, 2, 3, 4, 5, 6],
    tickFormat: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    name: this.capitalize(this.props.match.params.name),
    endpoint: 'http://localhost:5000',
    granularity: 'Daily',
    startingDate: new Date(),
    endingDate: new Date()
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

  componentDidUpdate() {
  }

updateGraph() {
  this.callGraphApi();
}

  callGraphApi = async () => {
    const graphJSON = {"location": this.state.name, "type": this.state.granularity.toLowerCase(), "startDate": this.state.startingDate, "endDate": this.state.endingDate};
    var jsonString = JSON.stringify(graphJSON)

    const response = await fetch('/data/' + jsonString);
    const body = await response.json();
    console.log(body) 
    this.buildGraph(body)  
  }

  buildGraph(data){
    var newValues = []
    var newFormat = []
    var newGraphData = []
    var accessor;

    if (this.state.granularity === "Weekly") {
      accessor = "Week";
    }
    else if (this.state.granularity === "Monthly") {
      accessor = "Month";
    }
    else if (this.state.granularity === "Yearly") {
      accessor = "Year";
    }
    else {
      accessor = "Day";
    }

    for(var i = 0; i < data.length; i++) {
      var row = data[i];
      var x_axis = row[accessor];
      var visitors = row.visitors;
      newFormat.push(String(x_axis.slice(0,10)))
      newGraphData.push(Number(visitors))
      newValues.push(i)
    }

    if (this.state.granularity === "Daily") {
      newGraphData[3] = 13
    }

    this.setState({tickFormat: newFormat})
    this.setState({graphData: newGraphData})
    this.setState({tickValues: newValues})
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
          this.setState({granularity: "Daily"} , () => { 
            console.log("Daily hit")
            this.updateGraph(str)
          });
        }

        if (str === "weekly") {
          this.refs.daily.toggle();
          this.refs.monthly.toggle();
          this.refs.yearly.toggle();
          
          this.setState({granularity: "Weekly"} , () => { 
            console.log("Weekly hit")
            this.updateGraph(str)
          });
        }

        if (str === "monthly") {
          this.refs.daily.toggle();
          this.refs.weekly.toggle();
          this.refs.yearly.toggle();

          this.setState({granularity: "Monthly"}, () => { 
            console.log("Monthly hit")
            this.updateGraph(str)
          });
        }

        if (str === "yearly") {
          this.refs.daily.toggle();
          this.refs.weekly.toggle();
          this.refs.monthly.toggle();

          this.setState({granularity: "Yearly"}, () => { 
            console.log("Yearly hit")
            this.updateGraph(str)
          });
        }
  }

  onStartingDateChange(date) {
    this.setState({ startingDate: date });
  }
  onEndingDateChange(date) {
    this.setState({ endingDate: date })
  }

  render() {
    const socket = socketIOClient();

    socket.on('refresh', newCount => {
      this.setState({ count: newCount });
    });

    var buttonStyle = {"display": "flex", "alignItems": "center", "justifyContent": "center"}

    return (
      <div className="container">
        <center>
          <h1>{this.state.name}</h1>
          <h1>{this.state.count}</h1>
          <h3>{this.state.granularity} Data from {this.state.startingDate.toLocaleDateString()} to {this.state.endingDate.toLocaleDateString()}</h3>
        </center>
        <center style={buttonStyle}>
            <Button ref="daily" text="Daily" update={ () => {this.buttonManager("daily") }}></Button>
            <Button ref="weekly" text="Weekly" update={ () => {this.buttonManager("weekly") }}></Button>
            <Button ref="monthly" text="Monthly" update={ () => {this.buttonManager("monthly") }}></Button>
            <Button ref="yearly" text="Yearly" update={ () => {this.buttonManager("yearly") }}></Button>
        </center>
        <VictoryChart theme={VictoryTheme.material} height={200} domainPadding={10}>
          <VictoryAxis
            style={{ tickLabels: {fontSize: 5}}}
            tickValues={ this.state.tickValues }
            tickFormat={ this.state.tickFormat }/>
          <VictoryAxis dependentAxis/>
          <VictoryLine
            data={this.state.graphData}/>
        </VictoryChart>
        <center>
          <DatePicker onChange={(date) => this.onStartingDateChange(date)} value={this.state.startingDate}/>
          <DatePicker onChange={(date) => this.onEndingDateChange(date)} value={this.state.endingDate}/>
        </center>
      </div>
    );
  }
}

export default Location;
