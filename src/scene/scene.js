import camera from './camera';
import light from './light';
import background from '../objects/background';

class Scene {
  constructor() {}

  init() {
    this.instance = new THREE.Scene();
    this.camera = camera;
    this.camera.init();
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true, // 抗锯齿
    });

    const axesHelper = new THREE.AxesHelper( 100 );
    this.instance.add( axesHelper );

    this.renderer.setClearColor(new THREE.Color(0x000000));

    // 加入光照
    this.light = light;
    this.light.init();
    this.instance.add( this.light.instance.ambientLight );
    this.instance.add( this.light.instance.directionLight );
    this.instance.add( this.light.instance.shadowTarget );

    // 加入背景，因为是正对相机，所以添加到相机坐标系下
    this.background = background;
    this.background.init();
    this.background.instance.position.z = -84;
    this.camera.instance.add( this.background.instance );
    this.instance.add(this.camera.instance);

    // 开启阴影
    this.renderer.shadowMap.enabled = true;
  }

  render() {
    this.renderer.render(this.instance, this.camera.instance);
  }

  updateCameraAndLightPosition (targetPosition) {
    this.camera.updatePosition(targetPosition)
    this.light.updatePosition(targetPosition)
  }

  reset() {
    this.camera.reset();
    this.light.reset();
  }
}

export default new Scene();