import React from 'react'
import { Text, View, Button, Image, TouchableOpacity} from 'react-native'

export default function Landing({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: '', backgroundColor: '#f47850'}}>
      <Image 
        source={require('/Users/wesli/stuport/frontend/assets/splash.png')}
        style = {{ width: 400, height: 500 }}/>
      
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
        color='#FFFFFF'
        backgroundColor='#165d96'
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")}
        color='#FFFFFF'
      />
    </View>
  )
}
