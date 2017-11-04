import * as firebase from 'firebase'
let config = {
    apiKey: "AIzaSyA2vUTQ8yQiRNCvJfSkVmUpbkghYhGbHpM",
    authDomain: "jawwad-gochat.firebaseapp.com",
    databaseURL: "https://jawwad-gochat.firebaseio.com",
    projectId: "jawwad-gochat",
    storageBucket: "jawwad-gochat.appspot.com",
    messagingSenderId: "956624126711"
};
export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database(); //the real-time database
export const auth = firebaseApp.auth(); //the firebase auth namespace
export const user = auth.currentUser;
export const storageKey = '4325423574235693';

export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
}

