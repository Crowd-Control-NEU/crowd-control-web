import React, { Component } from 'react';
import Button from './../buttons/button';
import socketIOClient from 'socket.io-client';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import DatePicker from 'react-date-picker';
import Odometer from 'react-odometerjs';

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
    granularity: 'Hourly Averages',
    startingDate: this.getStartingDate(),
    endingDate: new Date(),
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({
          count: res[0].count,
          graphData: res[0].hourlyAverages,
          hourlyAverages: res[0].hourlyAverages,
          dailyAverages: res[0].dailyAverages
        });
        this.setAverageTicks('HourlyAverages');
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
        tickFormat: this.state.days,
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
            graphData: this.state.hourlyAverages,
            granularity: 'Hourly Averages'
          });
          this.setAverageTicks('HourlyAverages');
        }

        if (str === 'avgDaily') {
          buttons.splice(1, 1);
          this.setState({
            graphData: this.state.dailyAverages,
            granularity: 'Daily Averages'
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

  getLabel(num) {
    if (this.state.tickFormat[num] !== '') {
      return this.state.tickFormat[num] + ': '
    }
    if (this.state.granularity === 'Hourly Averages') {
      var result = '';
      if (num < 12) {
        result = num + 'am: ';
      } else if (num === 24) {
        result = '12am: ';
      } else {
        result = (num - 12) + 'pm: ';
      }
      return result;
    }
    return '';
  }

  getStartingDate() {
    var date = new Date();
    date.setMonth(date.getMonth() - 2);
    return date;
  }

  render() {
    const socket = socketIOClient();

    socket.on('refresh', newCount => {
      this.setState({ count: newCount });
    });

    var buttonStyle = {"display": "flex", "alignItems": "center", "justifyContent": "center"}
    var lightBlue = '#328CC1';
    var darkBlue = '#0B3C5D';
    var yellow = '#D4AA12';
    const theme = {
      axis:
        {
          style: {
            axis: {
              fill: "transparent",
              stroke: darkBlue,
              strokeWidth: 1,
            },
            axisLabel: {
              padding: 25
            },
            grid: {
              fill: "transparent",
              stroke: darkBlue,
              pointerEvents: "visible"
            },
            ticks: {
              fill: darkBlue,
              size: 1,
              stroke: darkBlue
            },
            tickLabels: {
              fill: lightBlue,
            }
          }
        }
      ,
      line:
        {
          style: {
            data: {
              fill: "transparent",
              stroke: yellow,
              strokeWidth: 3
            },
          }
        }
      ,
      tooltip: {
        style: {
          padding: 5,
          pointerEvents: "none"
        },
        flyoutStyle: {
          stroke: lightBlue,
          strokeWidth: 1,
          fill: "#f0f0f0",
          pointerEvents: "none"
        },
        cornerRadius: 5,
        pointerLength: 10
      },
    };

    return (
      <div className="container">
        <center>
          <h1 className='ubuntu title'>{this.state.name}</h1>
          <Odometer value={this.state.count} format="(,ddd)"/>
          {
            this.state.granularity === 'Hourly Averages' ? (
              <h3 className='lightBlue'>{this.state.granularity} for {this.state.days[new Date().getDay()]}</h3>
            ) : this.state.granularity === 'Daily Averages' ? (
              <h3 className='lightBlue'>{this.state.granularity}</h3>
            ) : (
              <h3 className='lightBlue'>{this.state.granularity} Data from {this.state.startingDate.toLocaleDateString()} to {this.state.endingDate.toLocaleDateString()}</h3>
            )
          }
        </center>
        <VictoryChart theme={theme} height={200} domainPadding={10} padding={{top: 10, left: 50, right: 50, bottom: 20}} containerComponent={<VictoryVoronoiContainer/>}>
          <VictoryAxis
            style={{ tickLabels: {fontSize: 5}}}
            tickValues={ this.state.tickValues }
            tickFormat={ this.state.tickFormat }/>
          <VictoryAxis dependentAxis/>
          <VictoryLine
            data={this.state.graphData}
            labels={(datum) => this.getLabel(datum.x) + datum.y.toFixed(2)}
            labelComponent={<VictoryTooltip style={{ fontSize: 5 }}/>}
            style={{
              labels: {
                fontSize: 3
              }
            }}
            />
        </VictoryChart>
        <center style={buttonStyle}>
            <Button ref="avgHourly" text="Hourly Averages" update={ () => {this.buttonManager("avgHourly") }}></Button>
            <Button ref="avgDaily" text="Daily Averages" update={ () => {this.buttonManager("avgDaily") }}></Button>
            <Button ref="daily" text="Daily" update={ () => {this.buttonManager("daily") }}></Button>
            <Button ref="weekly" text="Weekly" update={ () => {this.buttonManager("weekly") }}></Button>
            <Button ref="monthly" text="Monthly" update={ () => {this.buttonManager("monthly") }}></Button>
        </center>
        <span><br/></span>
        <center>
          <DatePicker className='datepicker' onChange={(date) => this.onStartingDateChange(date)} value={this.state.startingDate}/>
          <DatePicker className='datepicker' onChange={(date) => this.onEndingDateChange(date)} value={this.state.endingDate}/>
        </center>
        <span><br/></span>
      </div>
    );
  }
}

export default Location;
