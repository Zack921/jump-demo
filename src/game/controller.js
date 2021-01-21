import gameView from './view';
import gameModel from './model';

class GameController {
  constructor() {
    this.gameView = gameView;
    this.gameModel = gameModel;
    this.gameModel.event.add((args) => {
      const stage = args.stage;
      switch (stage) {
        case 'game':
          this.gameView.showGamePage();
          break;
        case 'gameOver':
          this.gameView.showGameOverPage();
          break;
        default:
      }
    });
  }

  initPages () {
    const gamePageCallbacks = {
      showGameOverPage: () => {
        this.gameModel.setStage('gameOver');
      }
    };
    const gameOverPagesCallbacks = {
      gameRestart: () => {
        this.gameModel.setStage('game');
      }
    };
    this.gameView.initGamePage(gamePageCallbacks);
    this.gameView.initGameOverPage(gameOverPagesCallbacks);
  }

  startGame() {
    this.gameModel.setStage('game');
  }
}

export default new GameController();