// ✅ PhaserのESMビルドを使う
import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.esm.js";

export function startGame(containerId) {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#333",
    parent: containerId,
    scene: {
      preload() {},
      create() {
        this.add.text(300, 250, "簡易ゲーム", {
          fontSize: "24px",
          color: "#fff",
        });
      },
      update() {},
    },
  };

  new Phaser.Game(config);
}

// ✅ ページロード後に自動実行
window.addEventListener("DOMContentLoaded", () => {
  startGame("gameContainer");
});
