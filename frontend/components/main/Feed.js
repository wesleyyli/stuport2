import { getAuth } from "firebase/auth";
import {getFirestore, collection, doc, getDoc, getDocs, orderBy, query, Query, deleteDoc, addDoc, setDoc } from "firebase/firestore"; 

import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

import { connect } from 'react-redux'

import { authF, dbF } from "../../util/firebase";

import { container, utils , text} from '../styles'



function Feed(props) {
    const [posts, setPosts] = useState([]);

    const auth = authF;
    const db = dbF;

    useEffect(() => {
      if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
          props.feed.sort(function (x, y) {
              return y.creation.toDate() - x.creation.toDate();
          })

          setPosts(props.feed);
      }

  }, [props.usersFollowingLoaded, props.feed])

  const onLikePress = (userId, postId) => {
    const ref = doc(db, `posts/${userId}/userPosts/${postId}/likes/${authF.currentUser.uid}`)
    setDoc(ref, {"like": true})
  }
  const onDisikePress = (userId, postId) => {
    const ref = doc(db, `posts/${userId}/userPosts/${postId}/likes/${authF.currentUser.uid}`)
    setDoc(ref,  {"like": false})
  }
  return (
    <View style={[container.container]}>
      
      <View style={styles.containerGallery}>
          <FlatList
              numColumns={1}
              horizontal={false}
              data={posts}
              renderItem={({item}) => (
                  <View
                      style={styles.containerImage}>
                      <Text style={text.postName}>{item.user.name}</Text>
                      <Image
                          style={styles.image}
                          source={{uri: item.downloadURL}}
                      />
                      {/* { item.currentUserLike ?
                        (
                          <Button
                            title="Dislike"
                            onPress={() => onDisikePress(item.user.uid, item.id)}/>
                        )
                        :
                        (
                          <Button
                            title="Like"
                            onPress={() => onLikePress(item.user.uid, item.id)}/>
                        )
                      } */}
                      <Text
                        style={[text.profileDescription, styles.comments]}
                        onPress={() => 
                          props.navigation.navigate('Comment',
                          { postId: item.id, uid: item.user.uid})
                        }>
                      View Comments. . .
                      </Text>
                  </View>
              )}
          />
      </View>
    </View>
  )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 40
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    comments: {
      paddingLeft: 10,
      fontSize: 15
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);