import Animation from '../../libs/animation';

class Light {
  constructor() {
    this.instance = {}
  }

  init() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 环境光
    const directionLight = new THREE.DirectionalLight(0xffffff, 0.3); // 平行光
    directionLight.position.set(10, 30, 20); // 平行光光源位置

    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xF5f5f5 });
    const shadowTarget = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), basicMaterial); // 平行光光源指向,默认指向原点
    shadowTarget.name = 'shadowTarget';
    shadowTarget.visible = false;
    directionLight.target = shadowTarget;

    // 设置阴影
    directionLight.castShadow = true;
    // 设置截取的视晶体
    directionLight.shadow.camera.near = 0.5;
    directionLight.shadow.camera.far = 500;
    directionLight.shadow.camera.left = -100;
    directionLight.shadow.camera.right = 100;
    directionLight.shadow.camera.bottom = -100;
    directionLight.shadow.camera.top = 100;
    // 定义阴影贴图的宽高
    directionLight.shadow.mapSize.width = 1024;
    directionLight.shadow.mapSize.height = 1024;

    this.instance.ambientLight = ambientLight;
    this.instance.directionLight = directionLight;
    this.instance.shadowTarget = shadowTarget;
  }

  updatePosition(newTargetPosition) {
    Animation(this.instance.directionLight.position, {x: newTargetPosition.x + 10, y: newTargetPosition.y + 30, z: newTargetPosition.z + 20 }, 1, 'Linear', (data) => {
      this.instance.directionLight.position[data.prop] = data.value;
    });
    Animation(this.instance.shadowTarget.position, newTargetPosition, 1, 'Linear', (data) => {
      this.instance.shadowTarget.position[data.prop] = data.value;
    });
  }

  reset() {
    this.instance.directionLight.position.x = 10;
    this.instance.directionLight.position.y = 30;
    this.instance.directionLight.position.z = 20;
    this.instance.shadowTarget.position.x = 0;
    this.instance.shadowTarget.position.y = 0;
    this.instance.shadowTarget.position.z = 0;
  }
}

export default new Light();