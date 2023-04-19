import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {getFirestore, collection, doc, addDoc, serverTimestamp} from "firebase/firestore"; 

export default function Save(props) {
  const[caption, setCaption] = useState(null)
  const [downloadURL, setDownloadURL] = useState(null);
  const storage = getStorage();
  const auth = getAuth(); 
  const db = getFirestore();

  const uploadImage = async () => {
    
    const uri = props.route.params.image;
    const childPath = `post/${auth.currentUser.uid}/${Math.random().toString(36)}`
    
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, childPath)
    const task = uploadBytesResumable(storageRef, blob);

    const taskProgress = snapshot => {
        console.log(`transferred: ${snapshot.bytesTransferred}`)
    }

    const taskCompleted = () => {
        getDownloadURL(ref(storage, childPath)).then((downloadURL) => {
            setDownloadURL(downloadURL);
            savePostData(downloadURL)
            console.log(downloadURL)
        })
    }

    const taskError = snapshot => {
        console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted)

  }

  const savePostData = async (downloadURL) => {
    
    const usersPosts = collection(db, `posts/${auth.currentUser.uid}/userPosts`);


    await addDoc(usersPosts, {
        downloadURL,
        caption,
        likesCount: 0,
        creation: serverTimestamp()
    }).then((function () {
        props.navigation.popToTop();
    }))
    
    };

    return (
    <View style={{flex: 1}}>
        <Image source={{uri: props.route.params.image}}/>
        <TextInput
            placeholder='Write a Caption . . .'
            onChangeText={(caption) => setCaption(caption)}
        />
        <Button title="Save" onPress={() => uploadImage()}/>
    </View>
  )
}
