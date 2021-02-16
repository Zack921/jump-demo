import gameView from './view';
import gameModel from './model';
import scene from '../scene/scene';

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
        case 'restart':
          this.gameView.restartGamePage();
          break;
        default:
      }
    });
  }

  initPages () {
    this.scene = scene;
    this.scene.init();
    const gamePageCallbacks = {
      showGameOverPage: () => {
        this.gameModel.setStage('gameOver');
      }
    };
    const gameOverPagesCallbacks = {
      gameRestart: () => {
        this.gameModel.setStage('restart');
      }
    };
    this.gameView.initGamePage(gamePageCallbacks, this.scene);
    this.gameView.initGameOverPage(gameOverPagesCallbacks, this.scene);
  }

  startGame() {
    this.gameModel.setStage('game');
  }
}

export default new GameController();