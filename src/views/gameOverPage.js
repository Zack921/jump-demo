import sceneConf from '../confs/scene-conf';

export default class GameOverPage {
  constructor(callbacks) {
    this.callbacks = callbacks;
  }

  init({scene}) {
    console.log('game over page init');
    this.scene = scene;
  }

  show() {
    console.log('game over page show');

    const aspect = window.innerHeight / window.innerWidth;
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = '#333';
    this.context.fillRect((window.innerWidth - 200) / 2, (window.innerHeight - 100) / 2, 200, 100);
    this.context.fillStyle = '#eee';
    this.context.font = '20px Georgia';
    this.context.fillText('Game Over', (window.innerWidth - 200) / 2 + 50, (window.innerHeight - 100) / 2 + 55);

    this.texture = new THREE.Texture(this.canvas);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, side: THREE.DoubleSide });
    this.geometry = new THREE.PlaneGeometry(sceneConf.frustumSize * 2, aspect * sceneConf.frustumSize * 2);
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.position.z = 10;

    this.texture.needsUpdate = true;

    this.scene.camera.instance.add( this.obj ); // 加入背景，因为是正对相机，所以添加到相机坐标系下
  }

  hide() {
    console.log('game over page hide');
  }

}