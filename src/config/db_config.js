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
export const fireBaseUser = firebase.auth().currentUser;
console.log(fireBaseUser);
export const storageKey = 'localuserid';

export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
}

