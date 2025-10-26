import { auth, db } from "./firebaseConfig.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { collection, onSnapshot, doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { startGame } from "./phaserClient.js";

// タブ切替
const buttons = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('main section');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b=>b.classList.remove('active'));
    sections.forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// DOM
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regBtn = document.getElementById("regBtn");
const message = document.getElementById("message");
const newsList = document.getElementById("newsList");
const onlineCount = document.getElementById("onlineCount");

// ログイン
loginBtn.addEventListener("click", async ()=>{
  try{
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    message.textContent = `ログイン成功: ${userCredential.user.email}`;
  }catch(e){ message.textContent = e.message; }
});

// 新規登録
regBtn.addEventListener("click", async ()=>{
  try{
    const userCredential = await createUserWithEmailAndPassword(auth, regEmail.value, regPassword.value);
    message.textContent = `登録成功: ${userCredential.user.email}`;
    const userDoc = doc(db,"users",userCredential.user.uid);
    await setDoc(userDoc,{name:"",avatar:"",friends:[]});
  }catch(e){ message.textContent = e.message; }
});

// ログイン状態監視
onAuthStateChanged(auth, async (user)=>{
  if(user){
    const serverRef = doc(db,"server","status");
    await setDoc(serverRef,{onlinePlayers:increment(1)},{merge:true});
    buttons.forEach(b=>b.disabled=false);
  }
});

// ニュース取得
const newsCol = collection(db,"news");
onSnapshot(newsCol,snapshot=>{
  newsList.innerHTML="";
  snapshot.forEach(doc=>{
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    newsList.appendChild(li);
  });
});

// オンライン人数リアルタイム
const serverRef = doc(db,"server","status");
onSnapshot(serverRef, docSnap=>{
  if(docSnap.exists()) onlineCount.textContent = docSnap.data().onlinePlayers || 0;
});

// ゲーム起動
startGame("gameContainer");
