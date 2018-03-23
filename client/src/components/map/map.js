import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

class Map extends React.Component {
    componentDidMount() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lbGFsbHkxOCIsImEiOiJjamV6c29vZncwZnE2MnFvYXlhMzZ1d3k3In0.s1QC3xcFA-jG2MZX_wIPkA';
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v9'
      });
    }

    componentWillUnmount() {
      this.map.remove();
    }

    render() {
      const style = {
        'margin-top': '30px',
        'padding-left': '15%',
        width: '70%',
        height: '500px'
      };

      return <div style={style} ref={el => this.mapContainer = el} />;
    }
  }

  export default Map;
