import React, { Component } from 'react';
import Button from './../buttons/button';
import socketIOClient from 'socket.io-client';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import DatePicker from 'react-date-picker';

class Location extends Component {
  state = {
    count: 0,
    graphData: [],
    hourlyAverages: [],
    dailyAverages: [],
    tickValues: [],
    tickFormat: [],
    name: this.capitalize(this.props.match.params.name),
    endpoint: 'http://localhost:5000',
    granularity: 'Daily',
    startingDate: new Date(),
    endingDate: new Date()
  };

  componentDidMount() {
    this.callApi()
      .then(res => {
    //    this.setState({
    //      count: res[0].count,
    //      graphData: res[0].hourlyAverages,
   //       hourlyAverages: res[0].hourlyAverages,
  //        dailyAverages: res[0].dailyAverages
  //      });
 //       this.setAverageTicks('HourlyAverages');
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

    // so x axis does not get overcrowded with text
    var interval = 1
    if (data.length > 7) {
      interval = Math.ceil(data.length/7);
    }

    for(var i = 0; i < data.length; i++) {
      var row = data[i];
      var x_axis = row[accessor];
      var visitors = row.visitors;
      if (i%interval === 0) {
        newFormat.push(String(x_axis.slice(0,10)))
      }
      else {
        newFormat.push('')
      }
      newGraphData.push({"y": Number(visitors), "date":String(x_axis.slice(0,10))})
      newValues.push(i)
    }

    if (this.state.granularity === "Daily") {
      newGraphData[3] = 13
    }

    this.setState({tickFormat: newFormat})
    this.setState({graphData: newGraphData})
    this.setState({tickValues: newValues})
  }

  setAverageTicks(type) {
    if (type === 'HourlyAverages') {
      this.setState({
        tickValues: Array.apply(null, {length: 24}).map(Number.call, Number),
        tickFormat: ['12am', '', '', '3am', '', '', '6am', '', '', '9am', '', '',
                    '12pm', '', '', '3pm', '', '', '6pm', '', '', '9pm', '', ''],
      });
    } else if (type === 'DailyAverages') {
      this.setState({
        tickValues: Array.apply(null, {length: 7}).map(Number.call, Number),
        tickFormat: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      });
    }
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
        var buttons = ['avgHourly', 'avgDaily', 'daily', 'weekly', 'monthly', 'yearly'];

        if (str === 'avgHourly') {
          buttons.splice(0, 1);
          this.setState({
            graphData: this.state.hourlyAverages
          });
          this.setAverageTicks('HourlyAverages');
        }

        if (str === 'avgDaily') {
          buttons.splice(1, 1);
          this.setState({
            graphData: this.state.dailyAverages
          });
          this.setAverageTicks('DailyAverages')
        }

        if (str === "daily") {
          buttons.splice(2, 1);
          this.setState({granularity: "Daily"} , () => {
            console.log("Daily hit")
            this.updateGraph(str)
          });
        }

        if (str === "weekly") {
          buttons.splice(3, 1);
          this.setState({granularity: "Weekly"} , () => {
            console.log("Weekly hit")
            this.updateGraph(str)
          });
        }

        if (str === "monthly") {
          buttons.splice(4, 1);
          this.setState({granularity: "Monthly"}, () => {
            console.log("Monthly hit")
            this.updateGraph(str)
          });
        }

        if (str === "yearly") {
          buttons.splice(5, 1);
          this.setState({granularity: "Yearly"}, () => {
            console.log("Yearly hit")
            this.updateGraph(str)
          });
        }

        for (var i = 0; i < buttons.length; i++) {
          var button = buttons[i];
          this.refs[button].toggle();
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
            <Button ref="avgHourly" text="Hourly Averages" update={ () => {this.buttonManager("avgHourly") }}></Button>
            <Button ref="avgDaily" text="Daily Averages" update={ () => {this.buttonManager("avgDaily") }}></Button>
            <Button ref="daily" text="Daily" update={ () => {this.buttonManager("daily") }}></Button>
            <Button ref="weekly" text="Weekly" update={ () => {this.buttonManager("weekly") }}></Button>
            <Button ref="monthly" text="Monthly" update={ () => {this.buttonManager("monthly") }}></Button>
            <Button ref="yearly" text="Yearly" update={ () => {this.buttonManager("yearly") }}></Button>
        </center>
        <VictoryChart theme={VictoryTheme.material} height={200} domainPadding={10} containerComponent={<VictoryVoronoiContainer/>}>
          <VictoryAxis
            style={{ tickLabels: {fontSize: 3}}}
            tickValues={ this.state.tickValues }
            tickFormat={ this.state.tickFormat }/>
          <VictoryAxis dependentAxis/>
          <VictoryLine
            data={this.state.graphData}
            labels={(data) => data.date + '\n Max Count: ' + data.y }
            labelComponent={<VictoryTooltip style={{ fontSize: 5 }}/>}
            style={{
              labels: {
                fontSize: 3
              }
            }}
            />
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
