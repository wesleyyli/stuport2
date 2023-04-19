import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDGRk5hvnmcblgLsDrEUSf2Xs6hQoDhavk",
    authDomain: "stuport-5beea.firebaseapp.com",
    projectId: "stuport-5beea",
    storageBucket: "stuport-5beea.appspot.com",
    messagingSenderId: "718546409668",
    appId: "1:718546409668:web:ea292dbfd995037eb9d191",
    measurementId: "G-KX7RHETLN6"
  };

const app = initializeApp(firebaseConfig);
const authF = getAuth(app);
const dbF = getFirestore();

export { authF, dbF };