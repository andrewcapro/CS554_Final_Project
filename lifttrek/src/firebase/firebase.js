// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk8pgzdUITem4LOpQfhBu-ZSVDngTlwTw",
  authDomain: "cs554-buddies.firebaseapp.com",
  projectId: "cs554-buddies",
  storageBucket: "cs554-buddies.appspot.com",
  messagingSenderId: "428123130641",
  appId: "1:428123130641:web:2016dc82c889e054e61ab0",
  measurementId: "G-F0J49Q83VC"
};

// Initialize Firebase
const app =  firebase.initializeApp(firebaseConfig);
export default app
// export const analytics = getAnalytics(app);