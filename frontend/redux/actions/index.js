import { getFirestore, collection, doc, getDoc, getDocs, orderBy, query, Query, onSnapshot } from "firebase/firestore";
import { currentUser } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE,USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from "../constants/index";

import { authF, dbF } from "../../util/firebase";

const db = dbF;
const auth = authF;


export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return (async (dispatch) => {
        

        const userRef = doc(collection(db, 'users'), auth.currentUser.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists) {
            dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
        }
        else {
            console.log('user does not exist')
        }
    })
}

export function fetchUserPosts() {
    return (async (dispatch) => {


        const userRef = collection(db, `posts/${auth.currentUser.uid}/userPosts`);
        const q = query(userRef, orderBy("creation", "asc"));

        await getDocs(q).then((snapshot) => {
            const posts = snapshot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data };
            });
            dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
        });

    });
}

export function fetchUserFollowing() {
    return (async (dispatch) => {


        const userRef = collection(db, `following/${auth.currentUser.uid}/userFollowing`);
        const q = query(userRef);
        onSnapshot(userRef, (snapshot) => {
            const following = snapshot.docs.map((doc) => {
                const id = doc.id;
                
                return id
            });
            dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
            for (let i = 0; i < following.length; i++) {
                dispatch(fetchUsersData(following[i], true));
            }
            
        })

    })
}

export function fetchUsersData(uid, getPosts) {
    return (dispatch, getState) => {
        let found = false;
        if (getState().usersState.users !== [undefined] && getState().usersState.users.length !== 0) {
            
            found = getState().usersState.users.some(el => el.uid === uid);
        }
        if (!found) {
        const userRef = doc(collection(db, 'users'), uid);
        getDoc(userRef)
          .then(snapshot => {
            if (snapshot.exists()) {
              let user = snapshot.data();
              user.uid = snapshot.id;
  
              dispatch({ type: USERS_DATA_STATE_CHANGE, user});
              
              
            }
          })
          if(getPosts) {
            dispatch(fetchUsersFollowingPosts(uid));
            
          }
      }
    };
  }

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        const userRef = collection(db, `posts/${uid}/userPosts`);
        
        const q = query(userRef, orderBy("creation", "desc"));

        getDocs(q).then((snapshot) => {

            const uid = snapshot.docs[0].ref.path.split('/')[1];
            const user = getState().usersState.users.find(el => el.uid === uid);

            let posts = snapshot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data, user };
            });
            for(let i = 0; i < posts.length; i++) {
                dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
            }
            dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
            
        });

    });
}

export function fetchUsersFollowingLikes(uid, postId) {
    return ((dispatch, getState) => {
        const ref = doc(db, `posts/${uid}/userPosts/${postId}/likes/${authF.currentUser.uid}`)
        onSnapshot(ref, (snapshot) => {
            const postId = snapshot.id;
            let currentUserLike = false;
            if(snapshot.data() != undefined) {
                currentUserLike = true;
            }

                dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });

        });

    });
}

