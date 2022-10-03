import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD_PgEbxHTvkzORYuYJuij_6Nrt_VsUqfw",

  authDomain: "plants-336217.firebaseapp.com",

  databaseURL:
    "https://plants-336217-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "plants-336217",

  storageBucket: "plants-336217.appspot.com",

  messagingSenderId: "878799007977",

  appId: "1:878799007977:web:6cb93ce87b1c6b5dda0078",
};

const app = initializeApp(firebaseConfig);

export default app;
