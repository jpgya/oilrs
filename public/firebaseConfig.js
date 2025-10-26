// Firebase 初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvvZE5gwQ3iqPS_NjLC2k8Iut94Vv35nk",
  authDomain: "game-company-a9b66.firebaseapp.com",
  projectId: "game-company-a9b66",
  storageBucket: "game-company-a9b66.appspot.com",
  messagingSenderId: "631958708137",
  appId: "1:631958708137:web:ce99e065c05e4e6e3b6eb8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
