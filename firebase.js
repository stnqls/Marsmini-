import { getStorage } from "firebase/storage";
import getFirebaseConfig from "./firebase.config.js";
import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/storage";

async function init() {
  const config = await getFirebaseConfig();
  firebase.initializeApp(config);
}

export { init };
export default firebase;
