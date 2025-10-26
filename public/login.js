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
const regUsername = document.getElementById("regUsername");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regBtn = document.getElementById("regBtn");
const message = document.getElementById("message");
const selectedAvatar = document.getElementById("selectedAvatar");

// ログイン
loginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    message.textContent = `ログイン成功: ${userCredential.user.email}`;
    message.style.color = "#0f0";
    location.href = "index.html";
  } catch (e) {
    message.textContent = "ログイン失敗: " + e.message;
    message.style.color = "#f55";
  }
});

// 新規登録
regBtn.addEventListener("click", async () => {
  const username = regUsername.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value;
  const avatar = selectedAvatar.value;
  
  // バリデーション
  if (!username) {
    message.textContent = "ユーザーネームを入力してください";
    message.style.color = "#f55";
    return;
  }
  
  if (username.length < 3) {
    message.textContent = "ユーザーネームは3文字以上で入力してください";
    message.style.color = "#f55";
    return;
  }
  
  if (!email) {
    message.textContent = "メールアドレスを入力してください";
    message.style.color = "#f55";
    return;
  }
  
  if (!password) {
    message.textContent = "パスワードを入力してください";
    message.style.color = "#f55";
    return;
  }
  
  if (password.length < 6) {
    message.textContent = "パスワードは6文字以上で入力してください";
    message.style.color = "#f55";
    return;
  }
  
  if (!avatar) {
    message.textContent = "アバターを選択してください";
    message.style.color = "#f55";
    return;
  }
  
  try {
    // アカウント作成
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Firestoreにユーザー情報を保存
    try {
      const userDoc = doc(db, "users", userCredential.user.uid);
      await setDoc(userDoc, {
        name: username,
        avatar: avatar,
        friends: [],
        createdAt: new Date().toISOString()
      });
      console.log("Firestore write succeeded!");
    } catch (e) {
       console.error("Firestore write error:", e);
       message.textContent = "ユーザー情報の保存に失敗しました: " + e.message;
      message.style.color = "#f55";
    }

    
    message.textContent = `アカウント作成成功！ようこそ ${username} さん！`;
    message.style.color = "#0f0";
    
    // 2秒後にメイン画面へ
    setTimeout(() => {
      location.href = "index.html";
    }, 2000);
    
  } catch (e) {
    let errorMsg = "登録失敗: ";
    
    if (e.code === "auth/email-already-in-use") {
      errorMsg += "このメールアドレスは既に使用されています";
    } else if (e.code === "auth/invalid-email") {
      errorMsg += "無効なメールアドレスです";
    } else if (e.code === "auth/weak-password") {
      errorMsg += "パスワードが弱すぎます";
    } else {
      errorMsg += e.message;
    }
    
    message.textContent = errorMsg;
    message.style.color = "#f55";
  }
});

// ログイン状態監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href = "index.html";
  }
});