import * as firebase from 'firebase/app';
import "firebase/analytics";
import 'firebase/firestore';


var firebaseConfig = {
  apiKey: "AIzaSyCNZW2Y3mDFp2ZD09Z5cf4ztC3_O9YuCuQ",
  authDomain: "autoboop-b0b1a.firebaseapp.com",
  databaseURL: "https://autoboop-b0b1a.firebaseio.com",
  projectId: "autoboop-b0b1a",
  storageBucket: "autoboop-b0b1a.appspot.com",
  messagingSenderId: "488200747914",
  appId: "1:488200747914:web:e272114b13e08927f0a673",
  measurementId: "G-3SGDFSJYSS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics();
export const db = firebase.firestore()