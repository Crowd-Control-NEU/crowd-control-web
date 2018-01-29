import React, { Component } from 'react';

class LocationsList extends Component {
  state = {
        locations: []
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ locations: res.list }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/locations-list');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };


  render() {
    var data = this.state.locations;
    const listItems = data.map((d) => <li>{d.location_name}</li>);

    return (
      <div className="container">
        <h1>Locations List</h1>
        {listItems}
      </div>
    );
  }
}

export default LocationsList;
