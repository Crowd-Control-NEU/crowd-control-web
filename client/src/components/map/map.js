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
        position: 'absolute',
        top: '20%',
        left: '30%',
        bottom: 0,
        width: '40%',
        height: '40%'
      };
  
      return <div style={style} ref={el => this.mapContainer = el} />;
    }
  }
  
  export default Map;