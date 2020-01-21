import React, { useEffect } from 'react';

import { SafeAreaView, StyleSheet } from 'react-native';

import logo from '../assets/devradar.js';

import { AnimatedSVGPaths } from 'react-native-svg-animations';

export default function Splash({navigation}) {

  useEffect(()=>{
    setTimeout(()=>{
      navigation.navigate('App')
    },4500)
  },[])

  return (
    <SafeAreaView style={styles.container}>

      <AnimatedSVGPaths
        strokeColor={"#7159c1"}
        duration={2500}
        strokeWidth={3}
        height={100}
        width={355}
        scale={0.80}
        delay={1000}
        ds={logo}
        loop={false}
      />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})


