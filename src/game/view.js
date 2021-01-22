import GamePage from '../views/gamePage';
import GameOverPage from '../views/gameOverPage';

class GameView {
  constructor() {}

  initGamePage(callbacks, scene) {
    this.gamePage = new GamePage(callbacks);
    this.gamePage.init({
      scene,
    });
  }

  initGameOverPage(callbacks, scene) {
    this.gameOverPage = new GameOverPage(callbacks);
    this.gameOverPage.init({
      scene,
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