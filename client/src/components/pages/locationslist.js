import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class LocationsList extends Component {
  state = {
        locations: [],
        search: ""
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

  updateSearch(event) {
    this.setState({search: event.target.value})
  }

  render() {
    var data = this.state.locations;
    let filteredLocations = data.filter(
      (location) => {
        return location.location_name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }
    )
    const listItems = filteredLocations.map((d) => <Link to={'locations/' + d.location_name} ><li
        class="list-group-item"> {d.location_name} </li></Link>);

    return (
      <div className="container">
        <h1 className='ubuntu title'>Locations</h1>
        <input type="text" class="form-control" placeholder="Search" value={this.state.search} onChange={this.updateSearch.bind(this)}/>
        <br></br>
        {listItems}
      </div>
    );
  }
}

export default LocationsList;
