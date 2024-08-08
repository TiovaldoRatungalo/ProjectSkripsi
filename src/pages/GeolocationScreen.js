import React, {useEffect, useState} from 'react';
import {View, Text, Button, Linking, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const CustomHeader = ({ navigation, jsonData }) => {
  return (
    
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatScreen', { jsonData })}
        style={styles.backButton}>
        <Image
          source={require('../assets/icons/back.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
  );
};

const GeolocationScreen = ({ navigation, route }) => {
  const { jsonData } = route.params;
  const [currentPosition, setCurrentPosition] = useState(null);
  const destinations = {
    'Poli Saraf': {latitude: 1.440136, longitude: 125.117315},
    'Poli Bedah': {latitude: 1.439446, longitude: 125.118105},
    'Poli Kulit dan Kelamin': {latitude: 1.440135, longitude: 125.117531},
    'Poli Penyakit Dalam': {latitude: 1.440131, longitude: 125.117315},
    'Poli Anak': {latitude: 1.440151, longitude: 125.117324},
    'Poli Gigi': {latitude: 1.440141, longitude: 125.117353},
    'Poli Mata': {latitude: 1.440159, longitude: 125.117441},
    'Poli Umum': {latitude: 1.440146, longitude: 125.117321},
    'Poli THT': {latitude: 1.440149, longitude: 125.117294},
    'Poli Fisik dan Rehabilitasi': {latitude: 1.439862, longitude: 125.117061},
    'Poli Kandungan': {latitude: 1.4401, longitude: 125.117268},
    'Poli MCU pelaut/Kesehatan Pelaut': {
      latitude: 1.440205,
      longitude: 125.117613,
    },
    'Poli MCU': {latitude: 1.440205, longitude: 125.117613},
    'Poli Medikolegal ': {latitude: 1.440149, longitude: 125.117294},
    'Poli Jantung dan Pembuluh Darah': {
      latitude: 1.440167,
      longitude: 125.117439,
    },
    'Poli Paru': {latitude: 1.440082, longitude: 125.117032},
    IGD: {latitude: 1.4399134, longitude: 125.1184453},
    'Pusat Informasi RS': {latitude: 1.439944, longitude: 125.118064},
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentPosition({
          latitude,
          longitude,
        });
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  if (!currentPosition) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <Text style={{color: 'black', fontSize: 20}}>Loading...</Text>
      </View>

    );
  }

  const handleGetDirections = destination => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentPosition.latitude},${currentPosition.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=walking`;

    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatScreen', { jsonData })}
        style={styles.backButton}>
        <Image
          source={require('../assets/icons/back.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <Text style={{ color: 'black' }}>Latitude: {currentPosition.latitude}</Text>
      <Text style={{ color: 'black' }}>Longitude: {currentPosition.longitude}</Text>

      {route.params && route.params.location && (
        <Button
          title={`Lihat lokasi ${route.params.location}`}
          onPress={() => handleGetDirections(destinations[route.params.location])}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
  },
 

});

export default GeolocationScreen;
