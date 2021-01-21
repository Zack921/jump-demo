import Event from '../utils/event';

class GameModel {
  constructor() {
    this.stage = ''; // 当前显示的页面
    this.event = new Event();
  }

  setStage(stage) {
    this.stage = stage;
    this.event.notify({
      stage: stage
    });
  }

  getStage() {
    return this.stage;
  }
}

export default new GameModel();