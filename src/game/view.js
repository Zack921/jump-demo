import GamePage from '../views/gamePage';
import GameOverPage from '../views/gameOverPage';

class GameView {
  constructor() {}

  initGamePage(callbacks) {
    this.gamePage = new GamePage(callbacks);
    this.gamePage.init();
  }

  initGameOverPage(callbacks) {
    this.gameOverPage = new GameOverPage(callbacks);
    this.gameOverPage.init({
      scene: this.gamePage.scene.instance,
      camera: this.gamePage.camera.instance,
    });
  }

  showGamePage() {
    this.gameOverPage.hide();
    this.gamePage.show();
  }

  showGameOverPage() {
    this.gamePage.hide();
    this.gameOverPage.show();
  }
}

export default new GameView();