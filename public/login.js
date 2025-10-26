import { auth, db } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regBtn = document.getElementById("regBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    message.textContent = `ログイン成功: ${userCredential.user.email}`;
    location.href = "index.html"; // 成功したらメインへ
  } catch (e) {
    message.textContent = e.message;
  }
});

regBtn.addEventListener("click", async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, regEmail.value, regPassword.value);
    const userDoc = doc(db, "users", userCredential.user.uid);
    await setDoc(userDoc, { name: "", avatar: "", friends: [] });
    message.textContent = `登録成功: ${userCredential.user.email}`;
  } catch (e) {
    message.textContent = e.message;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href = "index.html";
  }
});
