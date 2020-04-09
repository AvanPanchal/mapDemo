import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Dimensions, TouchableOpacity, Text
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class App extends Component {
  constructor() {
    super()
    this.state = {
      markerData: {
        latitude: 0,
        longitude: 0
      },
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    }
  }

  componentDidMount() {
    geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
      console.log("initialRegion", initialRegion);
      this.setState({ initialPosition: initialRegion })
    },
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
  }

  onregionchange(region) {
    this.setState({ initialPosition: region });
  }

  changeLocation = () => {
    var data = this.state.initialPosition;
    this.setState({
      markerData: { latitude: data.latitude, longitude: data.longitude },
      initialPosition: data
    })
  }


  renderScreen = () => {
    console.log('region', this.state.initialPosition);
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          style={styles.map}
          initialRegion={this.state.initialPosition}
          onRegionChange={region => this.setState({ initialPosition: region })}
          onRegionChangeComplete={this.changeLocation}
        >
          <MapView.Marker
            draggable
            pinColor={'green'}
            coordinate={this.state.markerData}
          />
        </MapView>
        <View style={{
          position: 'absolute',
          top: '50%',
          alignSelf: 'flex-end'
        }}>
          <TouchableOpacity
            style={{
              minWidth: 50, height: 50, alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#fff', display: 'flex', borderRadius: 25, shadowColor: '#2AC062',
              shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { height: 10, width: 5 },
            }}
            onPress={() => this.changeLocation()}>
            <Text style={{ color: 'green', textAlign: 'center', fontSize: 25 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      this.renderScreen()
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1
  },
});

export default App;