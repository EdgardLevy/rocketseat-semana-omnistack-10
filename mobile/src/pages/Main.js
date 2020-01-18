import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

export default function Main({ navigation }) {

  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadInitialLocation() {
      //solicita a permissao do usuario
      const { granted } = await requestPermissionsAsync();
      //se tiver a permissao, entao pega a posicao atual do usuario
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        const { longitude, latitude } = coords;
        setCurrentRegion({
          longitude,
          latitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });

      }
    }
    loadInitialLocation();

  }, [])

  useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]))
  }, [devs])

  function setupWebSocket() {
    disconnect();

    const { latitude, longitude } = currentRegion

    connect(
      latitude,
      longitude,
      techs);
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;
    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
    })
    setDevs(response.data)
    setupWebSocket()
  }

  function handleRegionChange(region) {
    setCurrentRegion(region)
  }


  //enquanto n tiver as posicoes n renderiza nada na tela
  if (!currentRegion) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>

      <MapView
        onRegionChangeComplete={handleRegionChange}
        initialRegion={currentRegion}
        style={styles.map}>

        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1]
            }}>
            <Image
              style={styles.avatar}
              source={{ uri: dev.avatar_url }} />
            <Callout onPress={() => { navigation.navigate('Profile', { github_username: dev.github_username }) }}>
              <View style={styles.callout} >
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

      </MapView>


      <View style={styles.searchForm}>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={text => setTechs(text)}
        />

        <TouchableOpacity
          style={styles.loadButton}
          onPress={loadDevs}
        >
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>

      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#fff'
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,

    flexDirection: 'row'

  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2

  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4Dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
})


