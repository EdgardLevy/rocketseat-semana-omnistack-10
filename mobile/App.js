import React from 'react';
import Routes from './src/routes';
import {StatusBar,YellowBox} from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps'
])

export default function App() {
  return (
    <>
    <StatusBar
      barStyle="light-content"
      backgroundColor="#7D40E7"
     />
    <Routes />
    </>
  );
}

