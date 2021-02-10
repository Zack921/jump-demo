import sceneConf from '../confs/scene-conf';

class Camera {
  constructor() {}

  init() {
    const aspect = window.innerHeight / window.innerWidth;

    // 设置正交相机视晶体 width,height,depth
    this.instance = new THREE.OrthographicCamera(-sceneConf.frustumSize, sceneConf.frustumSize,
    sceneConf.frustumSize * aspect, -sceneConf.frustumSize * aspect, -100, 100);

    this.instance.position.set(-10, 10, 10)
    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

export default new Camera();