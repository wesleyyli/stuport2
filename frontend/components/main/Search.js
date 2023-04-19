import React, { useState} from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {getFirestore, collection, doc, getDocs, snapshotEqual, query, where } from "firebase/firestore"; 

export default function Search(props) {
    const [users, setUsers] = useState([])

    const db = getFirestore();

    const fetchUsers = async (search) => {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("name", '>=', search));
        await getDocs(q).then((snapshot) => {
            let users = snapshot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data };
              });
              setUsers(users);
        })
    }
    return (
      <View>
        <TextInput placeholder="Type Here..." onChangeText={(search) => fetchUsers(search)}/>

        <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            renderItem={({item}) => (
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                    
                    
                    <Text>{item.name}</Text>
                </TouchableOpacity>
                
            )}
        />
      </View>
    )
}