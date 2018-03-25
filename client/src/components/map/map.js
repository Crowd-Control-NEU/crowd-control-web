import React from 'react';
import mapboxgl from 'mapbox-gl';
import markerpng from './marker.png'

class Map extends React.Component {

    componentDidMount() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lbGFsbHkxOCIsImEiOiJjamV6c29vZncwZnE2MnFvYXlhMzZ1d3k3In0.s1QC3xcFA-jG2MZX_wIPkA';
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [-71.0892, 42.3398],
        zoom: 15,
      });

      var locations = [['Marino', [-71.090323, 42.340238]], ['Snell', [-71.088077, 42.338404]]]

      for (var i = 0; i < locations.length; i++) {
        this.addLocationToMap(locations[i]);
      }
    }

    addLocationToMap(loc) {
      var locationName = loc[0];
      var locationLatLon = loc[1];

      // create popup
      var popup = new mapboxgl.Popup()
      .setLngLat(locationLatLon)
      .setHTML('<h5>' + String(locationName) + '</h5>')
      .addTo(this.map) 

      // add marker
      var marker = document.createElement('img');
      marker.className = 'marker';
      marker.src = markerpng
      marker.style.width = '40px';
      marker.style.height = '60px';
      marker.addEventListener('click', function() {
        window.location.href = "/locations/" + locationName;
    });
      marker.addEventListener('mouseenter', function() {
        mar.togglePopup();

      })
      marker.addEventListener('mouseleave', function() {
        mar.togglePopup();
      })

      var mar =   new mapboxgl.Marker(marker)
        .setLngLat(locationLatLon)
        .addTo(this.map)
        .setPopup(popup)
        .togglePopup()
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