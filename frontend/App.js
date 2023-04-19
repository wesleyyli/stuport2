import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native';

import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Provider } from 'react-redux';
import { configureStore} from '@reduxjs/toolkit';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

const firebaseConfig = {
  apiKey: "AIzaSyDGRk5hvnmcblgLsDrEUSf2Xs6hQoDhavk",
  authDomain: "stuport-5beea.firebaseapp.com",
  projectId: "stuport-5beea",
  storageBucket: "stuport-5beea.appspot.com",
  messagingSenderId: "718546409668",
  appId: "1:718546409668:web:ea292dbfd995037eb9d191",
  measurementId: "G-KX7RHETLN6"
};

if(getApps().length === 0) {
  initializeApp(firebaseConfig);
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import CommentScreen from './components/main/Comment';

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded) {
      return(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Login" component={LoginScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
            </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      
    )
    
  }
}

export default App

