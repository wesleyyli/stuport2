import { async } from '@firebase/util';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Add({navigation}) {
  const [type, setType] = useState(CameraType.back);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission( cameraStatus.status === 'granted');

        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission( galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if(camera) {
        const data = await camera.takePictureAsync(null);
        setImage(data.uri)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View>

    </View>
  }

  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <View>
        <Text>No Access to Camera</Text>
    </View>
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={{ flex: 1}}>

    <View style={styles.cameraContainer}>
      <Camera 
        ref={ref => setCamera(ref)}
        style={ styles.fixedRatio} 
        type={type}
        ratio={'1:1'}/>

    </View>

        <Button 
            title="Flip Image"
            onPress={toggleCameraType}>
            
          </Button>
        <Button title="Take Picture" onPress={() => takePicture()}/>
        <Button title="Pick Image From Gallery" onPress={() => pickImage()}/>

        <Button title="Save" onPress={() => navigation.navigate('Save', {image})}/>
        {image && <Image source={{uri: image}} style={{flex: 1}}/>}
    </View>

  );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
})
