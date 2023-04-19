import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { container, form , utils} from '../styles';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {getFirestore, collection, doc, setDoc } from "firebase/firestore"; 

const accountTypes = ["Student", "Teacher", "Parent"]
export class Register extends Component {
  constructor(props) {
    super(props);

    
    
    this.state = {
        email: '',
        password: '',
        name: '',
        roll: '',
    }
    this.onSignUp = this.onSignUp.bind(this)
  }

onSignUp() {
    const { email, password, name} = this.state;
    
    const auth = getAuth();
    const db = getFirestore();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, auth.currentUser.uid);
      setDoc(userDoc, {
        name,
        email,
      });
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
            placeholder='name'
            onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
            style={form.textInput}
            placeholder='email'
            onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
            style={form.textInput}
            placeholder='password'
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
        />
        <SelectDropdown
            buttonStyle={{
              marginBottom: 10,
              borderColor: 'gray',
              backgroundColor: 'whitesmoke',
              borderWidth: 1,
              borderRadius: 8}}
            data={accountTypes}
            defaultButtonText="I am a ..."
            onSelect={(selectedItem, index) => {
                (roll) => this.setState({ roll })
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem
            }}
            rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
            }}
        />
        <Button
            onPress={() => this.onSignUp()}
            title="Sign Up"
        />
        </View>
        

        
      </View>
    )
  }
}

export default Register
