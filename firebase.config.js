const firebaseConfig = {
  apiKey: "AIzaSyAhMgEFzJxWOLvBr77HCeERUOSnSLFC5m8",
  authDomain: "npas-78659.firebaseapp.com",
  projectId: "npas-78659",
  storageBucket: "npas-78659.appspot.com",
  messagingSenderId: "788340342741",
  appId: "1:788340342741:web:2f1829069818d0f8b8475c",
  measurementId: "G-55HQBPRGVD",
};

const getFirebaseConfig = () =>
  new Promise((resolve, reject) => resolve(firebaseConfig));

export default getFirebaseConfig;
