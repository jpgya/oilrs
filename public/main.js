import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { doc, setDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { startGame } from "./phaserClient.js";

// DOM
const newsList = document.getElementById("newsList");
const onlineCount = document.getElementById("onlineCount");
const buttons = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('main section');

// タブ切替
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b=>b.classList.remove('active'));
    sections.forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ニュースをJSONから取得
async function loadNews() {
  try {
    const response = await fetch('news.json');
    const newsData = await response.json();
    
    newsList.innerHTML = "";
    newsData.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="news-date">${item.date}</span> ${item.text}`;
      newsList.appendChild(li);
    });
  } catch (error) {
    console.error("ニュースの読み込みに失敗:", error);
    newsList.innerHTML = "<li>ニュースの読み込みに失敗しました</li>";
  }
}

// ページ読み込み時にニュースを取得
loadNews();

// ログイン状態監視
onAuthStateChanged(auth, async (user)=>{
  if(!user){ 
    window.location.href="login.html"; 
    return; 
  }
  
  // オンライン人数をインクリメント
  const serverRef = doc(db,"server","status");
  await setDoc(serverRef,{onlinePlayers:increment(1)},{merge:true});
  buttons.forEach(b=>b.disabled=false);
});

// オンライン人数リアルタイム
const serverRef = doc(db,"server","status");
onSnapshot(serverRef, docSnap=>{
  if(docSnap.exists()) onlineCount.textContent = docSnap.data().onlinePlayers || 0;
});

// サーバーステータスリアルタイム
onSnapshot(serverRef, docSnap=>{
  if(docSnap.exists()) {
    const status = docSnap.data().serverStatus || "不明";
    document.getElementById("serverStatus").textContent = status;
  }
});

// ログアウト関数をグローバルに公開
window.logout = async function() {
  await auth.signOut();
  window.location.href = "login.html";
};

