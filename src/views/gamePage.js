import CuboidBlock from '../block/cuboid';
import CylinderBlock from '../block/cylinder';
import ground from '../objects/ground';
import bottle from '../objects/bottle';
import score from '../objects/score';
import bottleConf from '../confs/bottle-conf';
import utils from '../utils/index';

const HIT_STATE = {
  HIT_NEXT_BLOCK_CENTER: 1,
  HIT_CURRENT_BLOCK: 2,
  GAME_OVER_NEXT_BLOCK_BACK: 3,
  GAME_OVER_CURRENT_BLOCK_BACK: 4,
  GAME_OVER_NEXT_BLOCK_FRONT: 5,
  GAME_OVER_BOTH: 6,
  HIT_NEXT_BLOCK_NORMAL: 7
};

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.curBlock = null;
    this.checkingHit = false;
  }

  init({scene}) {
    console.log('game page init');
    this.scoreNum = 0;
    this.scene = scene;
    this.ground = ground;
    this.bottle = bottle;
    this.score = score;
    this.initScore();
    this.initGround();
    this.initBottle();
    this.initBlock();
    this.start();
  }

  show() {
    console.log('game page show');
  }

  initScore() {
    this.score.init({
      fillStyle: 0x666699,
    });
    this.score.instance.position.x = -20;
    this.score.instance.position.y = 40;
    this.scene.camera.instance.add( this.score.instance );
  }

  updateScore() {
    this.scene.camera.instance.remove( this.score.instance );
    this.score.updateScore(this.scoreNum);
    this.score.instance.position.x = -20;
    this.score.instance.position.y = 40;
    this.scene.camera.instance.add( this.score.instance );
  }

  initGround() {
    this.ground.init();
    this.scene.instance.add( this.ground.instance );
  }

  initBottle() {
    this.bottle.init();
    this.scene.instance.add( this.bottle.instance );
    this.bottle.showUp();
  }

  initBlock() {
    this.curBlock = new CuboidBlock(-15, 5, 0);
    this.scene.instance.add(this.curBlock.instance);

    this.nextBlock = new CylinderBlock(20, 5, 0);
    this.scene.instance.add(this.nextBlock.instance);

    this.targetPosition = {x: 20, y: 5, z: 0};
    this.setDirection('x');
  }

  addNextBlock() {
    this.curBlock = this.nextBlock;
    const type = Math.round(Math.random()) ? 'cuboid' : 'cylinder';
    const direction = Math.round(Math.random()) ? 'x' : 'z';
    const blockWidth = Math.round(Math.random() * 12) + 8;
    const distance = Math.round(Math.random() * 20) + 20;

    if(direction === 'x') {
      this.targetPosition = {
        x: this.curBlock.instance.position.x + distance,
        y: this.curBlock.instance.position.y,
        z: this.curBlock.instance.position.z,
      };
    } else {
      this.targetPosition = {
        x: this.curBlock.instance.position.x,
        y: this.curBlock.instance.position.y,
        z: this.curBlock.instance.position.z - distance,
      };
    }

    if(type === 'cuboid') {
      this.nextBlock = new CuboidBlock(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z, blockWidth);
    } else {
      this.nextBlock = new CylinderBlock(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z, blockWidth);
    }
    this.scene.instance.add(this.nextBlock.instance);
    this.setDirection(direction);

    const newTargetPosition = {
      x: (this.curBlock.instance.position.x + this.nextBlock.instance.position.x) / 2,
      y: (this.curBlock.instance.position.y + this.nextBlock.instance.position.y) / 2,
      z: (this.curBlock.instance.position.z + this.nextBlock.instance.position.z) / 2,
    };
    this.scene.updateCameraAndLightPosition(newTargetPosition);
    this.ground.updatePosition(newTargetPosition);

  }

  resetBlock() {
    let obj = this.scene.instance.getObjectByName('block');
    while(obj) {
      this.scene.instance.remove(obj);
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      if (obj.material) {
        obj.material.dispose();
      }
      obj = this.scene.instance.getObjectByName('block');
    }
  }

  render = () => {
    this.scene.render();
    this.bottle && this.bottle.update();
    this.curBlock && this.curBlock.update();
    this.checkingHit && this.handleBottleHit();
    requestAnimationFrame(this.render);
  }

  start() {
    this.bindEvent();
    this.render();
  }

  bindEvent() {
    canvas.addEventListener('touchstart', this.handleTouchStart);
    canvas.addEventListener('touchend', this.handleTouchEnd);
  }

  removeEvent() {
    canvas.removeEventListener('touchstart', this.handleTouchStart);
    canvas.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchStart = () => {
    this.touchStartTime = Date.now();
    this.curBlock.shrink();
    this.bottle.shrink();
  };

  handleTouchEnd = () => {
    if(!this.touchStartTime) return;
    const duration = Date.now() - this.touchStartTime;

    this.bottle.velocity.vx = Math.min(duration / 6, 400);
    this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2);
    this.bottle.velocity.vy = Math.min(150 + duration / 20, 400);
    this.bottle.velocity.vy = +this.bottle.velocity.vy.toFixed(2);

    const initY = (1 - this.curBlock.instance.scale.y) * this.curBlock.height / 2;
    this.hit = this.getHitState(this.bottle, this.curBlock, this.nextBlock, initY);
    this.checkingHit = true;

    this.curBlock.rebound();
    this.bottle.doRotate();
    this.bottle.jump();
    this.touchStartTime = null;
  };

  setDirection(direction) {
    const currentPosition = {
      x: this.bottle.instance.position.x, 
      z: this.bottle.instance.position.z,
    };
    this.axis = new THREE.Vector3(this.targetPosition.x - currentPosition.x, 0, this.targetPosition.z - currentPosition.z);
    this.axis.normalize();
    this.bottle.setDirection(direction, this.axis);
  }

  // 碰撞检测
  getHitState(bottle, currentBlock, nextBlock, initY) {
    let flyingTime = bottle.velocity.vy / bottleConf.gravity * 2; // 回落到压缩后的block上的时长
    initY = initY.toFixed(2);

    const differenceY = currentBlock.height / 2;
    // 压缩block的时长
    const time = +((-bottle.velocity.vy + Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * bottleConf.gravity * differenceY)) / -bottleConf.gravity).toFixed(2);
    flyingTime -= time;
    flyingTime = +flyingTime.toFixed(2); // 回落到下一个block上的时长(未压缩)

    const destination = []; // 跳跃后水平面上的落点
    const bottlePosition = new THREE.Vector2(bottle.instance.position.x, bottle.instance.position.z);
    const translate = new THREE.Vector2(this.axis.x, this.axis.z).setLength(bottle.velocity.vx * flyingTime);
    bottlePosition.add(translate);
    bottle.destination = [+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2)];
    destination.push(+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2));

    const nextDiff = Math.pow(destination[0] - nextBlock.instance.position.x, 2) + Math.pow(destination[1] - nextBlock.instance.position.z, 2);
    const nextPolygon = nextBlock.getVertices();
    let result1;
    if (utils.pointInPolygon(destination, nextPolygon)) {
      if (Math.abs(nextDiff) < 5) {
        return HIT_STATE.HIT_NEXT_BLOCK_CENTER;
      } else {
        return HIT_STATE.HIT_NEXT_BLOCK_NORMAL;
      }
    } else if (utils.pointInPolygon([destination[0] - bottleConf.bodyWidth / 2, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] + bottleConf.bodyWidth / 2], nextPolygon)) {
      result1 = HIT_STATE.GAME_OVER_NEXT_BLOCK_FRONT;
    } else if (utils.pointInPolygon([destination[0], destination[1] - bottleConf.bodyWidth / 2], nextPolygon) || utils.pointInPolygon([destination[0] + bottleConf.bodyWidth / 2, destination[1]], nextPolygon)) {
      result1 = HIT_STATE.GAME_OVER_NEXT_BLOCK_BACK;
    }

    let result2;
    const currentPolygon = currentBlock.getVertices();
      if (utils.pointInPolygon(destination, currentPolygon)) {
        result2 = HIT_STATE.HIT_CURRENT_BLOCK
      } else if (utils.pointInPolygon([destination[0] - bottleConf.bodyWidth / 2, destination[1]], currentPolygon) || utils.pointInPolygon([destination[0], destination[1] + bottleConf.bodyWidth / 2], currentPolygon)) {
        if (result1) {
          result2 = HIT_STATE.GAME_OVER_BOTH;
        }
        result2 = HIT_STATE.GAME_OVER_CURRENT_BLOCK_BACK;
      }
    return result1 || result2 || 0;
  }

  handleBottleHit() {
    if (this.bottle.instance.position.y <= this.nextBlock.height && this.bottle.state === 'jump' && this.bottle.flyingTime > 0.3) {
      this.checkingHit = false;
      if (this.hit == 1 || this.hit == 7 || this.hit == 2) { // 游戏继续
        this.bottle.stop();
        this.bottle.instance.position.y = bottleConf.initPosition.y + 12;
        this.bottle.instance.position.x = this.bottle.destination[0];
        this.bottle.instance.position.z = this.bottle.destination[1];
        this.addNextBlock();
        this.scoreNum++;
        this.updateScore();
      } else { //游戏结束
        this.scoreNum = 0;
        this.updateScore();
        this.bottle.stop();
        this.removeEvent();
        this.bottle.instance.position.y = -100;
        this.callbacks.showGameOverPage();
      }
    }
  }

  restart() {
    this.ground.reset();
    this.scene.reset();
    this.resetBlock();
    this.bottle.reset();
    this.initBlock();
    this.bindEvent();
  }
}