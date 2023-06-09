import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import AppNavigator from './src/navigations/Navigator';
import * as SplashScreen from 'expo-splash-screen';
import AppLoading from 'expo-app-loading';



export default class App extends React.Component{
  state={
    isFontLoaded:false
  }
  async componentDidMount(){
    await Font.loadAsync({
      'Bold':require('./src/fonts/Montserrat-ExtraBold.otf'),
      'Medium':require('./src/fonts/Montserrat-Medium.otf'),
      'Regular':require('./src/fonts/Montserrat-Regular.otf'),
    });
    this.setState({isFontLoaded:true})
  }
  render(){
    return (
    (this.state.isFontLoaded === true)?(<AppNavigator/>) : (<AppLoading/>)
      );
  }
  
}

