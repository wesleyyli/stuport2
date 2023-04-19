import { getAuth } from "firebase/auth";
import {getFirestore, collection, doc, getDoc, getDocs, orderBy, query, Query, deleteDoc, addDoc, setDoc } from "firebase/firestore"; 

import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

import { connect } from 'react-redux'

import { authF, dbF } from "../../util/firebase";



function Profile(props) {
    const [userPosts, setUserPost] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false)

    const auth = authF;
    const db = dbF;

    useEffect( () => {
        const { currentUser, posts } = props;
        console.log({ currentUser, posts })

        if(props.route.params.uid === auth.currentUser.uid) {
            setUser(currentUser)
            setUserPost(posts)
            setLoading(false)
            
        } else {

            const userRef = doc(collection(db, 'users'), props.route.params.uid);
            const snapshot = getDoc(userRef);
            if(snapshot.exists){
                setUser(snapshot.data())
            }
            else {
                console.log('profile does not exist')
            }
            setLoading(false)

            const userRef2 = collection(db, `posts/${props.route.params.uid}/userPosts`);
            const q = query(userRef2, orderBy("creation", "asc"));
        
             getDocs(q).then((snapshot) => {
            const posts = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data };
            });
            setUserPost(posts)
          });

        }

        if(props.following.indexOf(props.route.params.uid) > -1){
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const onFolllow = () => {
        const followingRef = doc(collection(doc(collection(db, "following"), auth.currentUser.uid), "userFollowing"), props.route.params.uid)
        const snapshot = setDoc(followingRef, {})
        setFollowing(true);
    }
    const onUnfolllow = () => {
        const followingRef = doc(collection(doc(collection(db, "following"), auth.currentUser.uid), "userFollowing"), props.route.params.uid)
        const snapshot = deleteDoc(followingRef)
        setFollowing(false);
    }

    const onLogout = () => {
        auth.signOut();
    }

    if(user === null) {
        return <View/>
    }
    return (
      <View style={styles.container}>
        <View style={styles.containerInfo}>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>

            {props.route.params.uid !== auth.currentUser.uid ? (
                <View>
                    {following ? (
                        <Button
                            title="Following"
                            onPress={() => onUnfolllow()}
                        />
                    ) : (
                        <Button
                            title="Follow"
                            onPress={() => onFolllow()}
                        />
                    )}
                </View>
            ) : 
                <Button
                    title="Logout"
                    onPress={() => onLogout()}
                />}
        </View>
        <View style={styles.containerGallery}>
            <FlatList
                numColumns={3}
                horizontal={false}
                data={userPosts}
                renderItem={({item}) => (
                    <View
                        style={styles.containerImage}>
                        <Image
                            style={styles.image}
                            source={{uri: item.downloadURL}}
                        />
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
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile);