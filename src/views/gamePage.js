import CuboidBlock from '../block/cuboid';
import CylinderBlock from '../block/cylinder';
import ground from '../objects/ground';

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks;
  }

  init({scene}) {
    console.log('game page init');
    this.scene = scene;
    this.ground = ground;
    this.ground.init();
    this.addGround();
    this.draw();
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

  draw() {
    const cuboidBlock = new CuboidBlock(-20, 0, 0);
    this.scene.instance.add(cuboidBlock.instance);

    const cylinderBlock = new CylinderBlock(20, 0, 0);
    this.scene.instance.add(cylinderBlock.instance);

    const render = () => {
      this.scene.render();
      requestAnimationFrame(render);
    }

    render();
  }
}