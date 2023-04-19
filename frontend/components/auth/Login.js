import React, { Component } from 'react'
import { View, Button, TextInput, Text } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { container, form } from '../styles';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const accountTypes = ["Student", "Teacher", "Parent"]
export class Login extends Component {
  constructor(props) {
    super(props);

    
    
    this.state = {
        email: '',
        password: '',
        name: '',
        roll: ''
    }
    this.onSignUp = this.onSignUp.bind(this)
  }

onSignUp() {
    const { email, password } = this.state;
    
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        // console.log(userCredential)
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error)
      });
  }
    render() {
    return (
      <View style={container.center}>
      <View style={container.formCenter}>
          <TextInput
              style={form.textInput}
              placeholder="email"
              onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
              style={form.textInput}
              placeholder="password"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
          />

          <Button
              color={'#000000'}
              onPress={() => this.onSignUp()}
              title="Sign In"
          />
      </View>

  </View>
    )
  }
}

export default Login
