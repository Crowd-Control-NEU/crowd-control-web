import React from 'react';
import mapboxgl from 'mapbox-gl';

class Map extends React.Component {

    componentDidMount() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lbGFsbHkxOCIsImEiOiJjamV6c29vZncwZnE2MnFvYXlhMzZ1d3k3In0.s1QC3xcFA-jG2MZX_wIPkA';
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [-71.0892, 42.3398],
        zoom: 15,
      });

      // marino marker on map
      var marinoMarker = document.createElement('div');
      marinoMarker.className = 'marker';
      marinoMarker.textContent = "MARINO"
      marinoMarker.style.fontWeight = 'bold'
      marinoMarker.style.backgroundColor = "red"
      marinoMarker.addEventListener('click', function() {
        window.location.href = "/locations/marino"
    });

      // snell marker on map
      var snellMarker = document.createElement('div');
      snellMarker.className = 'marker';
      snellMarker.textContent = "SNELL LIBRARY"
      snellMarker.style.fontWeight = 'bold'
      snellMarker.style.backgroundColor = "red"
      snellMarker.addEventListener('click', function() {
        window.location.href = "/locations/snell"
    });

      new mapboxgl.Marker(marinoMarker)
        .setLngLat([-71.090323, 42.340238])
        .addTo(this.map);

      new mapboxgl.Marker(snellMarker)
        .setLngLat([-71.088077, 42.338404])
        .addTo(this.map);
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