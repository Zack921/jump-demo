import * as THREE from '../libs/three.js';
import gameController from './game/controller';

window.THREE = THREE;
class Main {
  constructor() {
    this.gameController = gameController;
  };
  init() {
    this.gameController.initPages();
    this.gameController.startGame();
  }
}

export default new Main();