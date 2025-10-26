import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// 静的ファイル提供
app.use(express.static("public")); // HTML, JS, CSS を public フォルダに置く

// WebSocket接続
io.on("connection", (socket) => {
  console.log("ユーザー接続:", socket.id);

  // 座標やアクション受信
  socket.on("playerMove", (data) => {
    // 他プレイヤーにブロードキャスト
    socket.broadcast.emit("playerMove", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("ユーザー切断:", socket.id);
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on ${PORT}`));
