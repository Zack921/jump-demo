import sceneConf from '../confs/scene-conf';
import Animation from '../../libs/animation';

class Camera {
  constructor() {}

  init() {
    const aspect = window.innerHeight / window.innerWidth;

    // 设置正交相机视晶体 width,height,depth
    this.instance = new THREE.OrthographicCamera(-sceneConf.frustumSize, sceneConf.frustumSize,
    sceneConf.frustumSize * aspect, -sceneConf.frustumSize * aspect, -100, 100);

    this.target = new THREE.Vector3(0, 0, 0);
    this.instance.position.set(-10, 10, 10)
    this.instance.lookAt(this.target);
  }

  updatePosition(newTargetPosition) {
    Animation(this.instance.position, {x: newTargetPosition.x - 10, y: newTargetPosition.y + 10, z: newTargetPosition.z + 10 }, 1, 'Linear', (data) => {
      this.instance.position[data.prop] = data.value;
    });
    Animation(this.target, newTargetPosition, 1, 'Linear', (data) => {
      this.target[data.prop] = data.value;
    });
  }
}

export default new Camera();