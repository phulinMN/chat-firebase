import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/firestore'

Vue.use(VueFire)
var firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAGbcRm_hTe_4_wYjyFS2ytp6KSPINuxEA",
  authDomain: "test-e38d2.firebaseapp.com",
  databaseURL: "https://test-e38d2.firebaseio.com",
  projectId: "test-e38d2",
  storageBucket: "test-e38d2.appspot.com",
  messagingSenderId: "996907829295"
})

const firestore = firebaseApp.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);
export default (context, inject) => {
  inject('firebase', firebase)
}
