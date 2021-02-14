import CuboidBlock from '../block/cuboid';
import CylinderBlock from '../block/cylinder';
import ground from '../objects/ground';
import bottle from '../objects/bottle';

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.curBlock = null;
  }

  init({scene}) {
    console.log('game page init');
    this.scene = scene;
    this.ground = ground;
    this.bottle = bottle;
    this.ground.init();
    this.bottle.init();
    this.addGround();
    this.addBottle();
    this.addBlock();
    this.start();
  }

  show() {
    console.log('game page show');
    // setTimeout(() => {
    //   this.callbacks.showGameOverPage();
    // }, 2000);
  }

  hide() {
    console.log('game page hide');
  }

  addGround() {
    this.scene.instance.add( this.ground.instance );
  }

  addBottle() {
    this.scene.instance.add( this.bottle.instance );
    this.bottle.showUp();
  }

  addBlock() {
    this.curBlock = new CuboidBlock(-15, 5, 0);
    this.scene.instance.add(this.curBlock.instance);

    const cylinderBlock = new CylinderBlock(20, 5, 0);
    this.scene.instance.add(cylinderBlock.instance);

    this.targetPosition = {
      x: 20,
      y: 5,
      z: 0
    }
    this.setDirection('x');

    const render = () => {
      this.scene.render();
      this.bottle && this.bottle.update();
      this.curBlock && this.curBlock.update();
      requestAnimationFrame(render);
    }

    render();
  }

  start() {
    this.bindEvent();
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
    const duration = Date.now() - this.touchStartTime;

    this.bottle.velocity.vx = Math.min(duration / 6, 400);
    this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2);
    this.bottle.velocity.vy = Math.min(150 + duration / 20, 400);
    this.bottle.velocity.vy = +this.bottle.velocity.vy.toFixed(2);

    this.curBlock.rebound();
    this.bottle.doRotate();
    this.bottle.jump();
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
}