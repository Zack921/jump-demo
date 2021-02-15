// 地面
import Animation from '../../libs/animation';

class Ground {
  constructor() {}

  init() {
    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.ShadowMaterial({ // 可以发出或接受阴影的材质
      color: 0x000000,
      transparent: true,
      opacity: 0.3
    });

    this.instance = new THREE.Mesh(geometry, material);
    this.instance.rotation.x = -Math.PI / 2;
    this.instance.position.y = -16 / 3.2;

    this.instance.receiveShadow = true;
  }

  updatePosition(newTargetPosition) {
    this.instance.position.x = newTargetPosition.x
    this.instance.position.z = newTargetPosition.z
  }
}

export default new Ground();