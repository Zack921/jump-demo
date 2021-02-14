import bottleConf from '../confs/bottle-conf';
import blockConf from '../confs/block-conf';
import Animation from '../../libs/animation';

class Bottle {
  constructor() {
    this.state = 'stop';
    this.scale = 1;
    this.velocity = {
      vx: 0, // 水平方向速度
      vy: 0, //竖直方向速度
    };
    this.flyingTime = 0; // 飞行时间
    this.direction = 'x'; // 跳跃方向
  }

  init() {
    this.name = 'bottle';
    this.axis = new THREE.Vector3(1, 0, 0);
    this.instance = new THREE.Object3D();
    this.instance.position.set(bottleConf.initPosition.x, bottleConf.initPosition.y + 30, bottleConf.initPosition.z);

    const textures = this.loadTexture();

    const headRadius = bottleConf.headRadius;
    this.head = new THREE.Mesh(new THREE.OctahedronGeometry(headRadius * 1.4), textures.headMaterial);
    this.head.position.set(0, 7.56, 0);
    this.head.castShadow = true;

    this.body = new THREE.Object3D();
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.88 * headRadius, 1.27 * headRadius, 2.68 * headRadius, 20), textures.bottomMaterial);
    bottom.castShadow = true;

    const middle = new THREE.Mesh(new THREE.CylinderGeometry(headRadius, 0.88 * headRadius, 1.2 * headRadius, 20), textures.topMaterial);
    middle.position.set(0, bottom.position.y + 1.54 * headRadius, 0);
    middle.castShadow = true;
    
    const top = new THREE.Mesh(new THREE.SphereGeometry(headRadius, 20, 20), textures.topMaterial);
    top.position.set(0, bottom.position.y + 2.04 * headRadius, 0);
    top.castShadow = true;

    this.body.add(bottom);
    this.body.add(middle);
    this.body.add(top);

    this.human = new THREE.Object3D(); // 为了跳跃时能自转 多套一层
    this.human.add(this.head);
    this.human.add(this.body);

    this.instance.add(this.human);
  }

  loadTexture() {
    const loader = new THREE.TextureLoader();

    const headTexture = loader.load('/game/res/images/head.png'); // 小游戏规定资源要加game前缀
    const headMaterial = new THREE.MeshBasicMaterial({ map: headTexture });

    const bottomTexture = loader.load('/game/res/images/bottom.png');
    const bottomMaterial = new THREE.MeshBasicMaterial({ map: bottomTexture });

    const topTexture = loader.load('/game/res/images/top.png');
    const topMaterial = new THREE.MeshBasicMaterial({ map: topTexture });

    return {
      headMaterial,
      bottomMaterial,
      topMaterial
    };
  }

  update() {
    if(this.state === 'shrink') {
      this.doShrink();
    } else if (this.state === 'jump') {
      const tickTime = Date.now() - this.lastFrameTime;
      this.doJump(tickTime);
    }
    this.head.rotation.y += 0.06;
    this.lastFrameTime = Date.now();
  }

  setDirection(direction, axis) {
    this.direction = direction;
    this.axis = axis;
  }

  showUp() {
    Animation({y: this.instance.position.y}, {y: bottleConf.initPosition.y + 12}, 1, 'BounceEaseOut', (data) => {
      this.instance.position.y = data.value;
    });
  }

  shrink() {
    this.state = 'shrink';
  }

  jump() {
    this.state = 'jump';
  }

  doShrink() {
    const DELTA_SCALE = 0.005;
    const MIN_SCALE = 0.55;
    const HORIZON_DELTA_SCALE = 0.007; // x,z
    const HEAD_DELTA = 0.03;
    const nextScale = this.scale - DELTA_SCALE;
    this.scale = Math.max(nextScale, MIN_SCALE);
    if(this.scale <= MIN_SCALE) {
      return;
    }

    this.head.position.y -= HEAD_DELTA;
    this.body.scale.y = this.scale;
    this.body.scale.x += HORIZON_DELTA_SCALE;
    this.body.scale.z += HORIZON_DELTA_SCALE;
    const bottleDeltaY = HEAD_DELTA / 2;
    const blockDeltaY = blockConf.height * DELTA_SCALE / 2;
    this.instance.position.y -= bottleDeltaY + blockDeltaY * 2;
  }

  doJump(tickTime) {
    const t = tickTime / 1000;
    this.flyingTime += t;

    const translateY = this.velocity.vy * t - 0.5 * bottleConf.gravity * t * t - bottleConf.gravity * this.flyingTime * t;
    const translateH = this.velocity.vx * t;

    this.instance.translateY(translateY);
    this.instance.translateOnAxis(this.axis, translateH);
  }

  doRotate() {
    const scale = 1.4;
    this.human.rotation.x = 0;
    this.human.rotation.z = 0;
    if(this.direction === 'x') {
      Animation({rotation: this.human.rotation.z}, {rotation: this.human.rotation.z - Math.PI}, 0.14, 'Linear', (data) => {
        this.human.rotation.z = data.value;
      });
      Animation({rotation: this.human.rotation.z}, {rotation: this.human.rotation.z - 2 * Math.PI}, 0.18, 'Linear', (data) => {
        this.human.rotation.z = data.value;
      }, 0.14);
      Animation(
        {
          x: this.head.position.x,
          y: this.head.position.y
        }, 
        {
          x: this.head.position.x + 0.45 * scale, 
          y: this.head.position.y + 0.9 * scale,
        }, 0.1, 'Linear', (data) => {
          this.head.position[data.prop] = data.value;
      });
      Animation(
        {
          x: this.head.position.x,
          y: this.head.position.y
        }, 
        {
          x: this.head.position.x - 0.45 * scale, 
          y: this.head.position.y - 0.9 * scale,
        }, 0.1, 'Linear', (data) => {
          this.head.position[data.prop] = data.value;
      }, 0.2);
      Animation(
        {
          x: this.head.position.x,
          y: this.head.position.y
        }, 
        {
          x: 0, 
          y: 7.56,
        }, 0.15, 'Linear', (data) => {
          this.head.position[data.prop] = data.value;
      }, 0.25);
      Animation(
        this.body.scale, 
        {
          x: scale / 2, 
          y: scale,
          z: scale / 2
        }, 0.1, 'Linear', (data) => {
          this.body.scale[data.prop] = data.value;
      });
      Animation(
        this.body.scale, 
        {
          x: scale, 
          y: scale / 2,
          z: scale
        }, 0.1, 'Linear', (data) => {
          this.body.scale[data.prop] = data.value;
      }, 0.1);
      Animation(
        this.body.scale, 
        {
          x: 1, 
          y: 1,
          z: 1
        }, 0.3, 'Linear', (data) => {
          this.body.scale[data.prop] = data.value;
      }, 0.2);
    } else if(this.direction === 'z') {
      Animation({rotation: this.human.rotation.x}, {rotation: this.human.rotation.x - Math.PI}, 0.14, 'Linear', (data) => {
        this.human.rotation.x = data.value;
      });
      Animation({rotation: this.human.rotation.x}, {rotation: this.human.rotation.x - 2 * Math.PI}, 0.18, 'Linear', (data) => {
        this.human.rotation.x = data.value;
      }, 0.14);
      Animation(
        {
          z: this.head.position.z,
          y: this.head.position.y
        }, 
        {
          z: this.head.position.z - 0.45 * scale, 
          y: this.head.position.y + 0.9 * scale,
        }, 0.1, 'Linear', (data) => {
          this.head.position[data.prop] = data.value;
      });
      Animation(
        {
          z: this.head.position.z,
          y: this.head.position.y
        }, 
        {
          z: this.head.position.z + 0.45 * scale, 
          y: this.head.position.y - 0.9 * scale,
        }, 0.1, 'Linear', (data) => {
          this.head.position[data.prop] = data.value;
      }, 0.2);
      Animation(
        {
          z: this.head.position.z,
          y: this.head.position.y
        }, 
        {
          z: 0, 
          y: 7.56,
        }, 0.15, 'Linear', (data) => {
          this.head.position[data.prop] = data.value;
      }, 0.25);
      Animation(
        this.body.scale, 
        {
          x: scale / 2, 
          y: scale,
          z: scale / 2
        }, 0.05, 'Linear', (data) => {
          this.body.scale[data.prop] = data.value;
      });
      Animation(
        this.body.scale, 
        {
          x: scale, 
          y: scale / 2,
          z: scale
        }, 0.1, 'Linear', (data) => {
          this.body.scale[data.prop] = data.value;
      }, 0.05);
      Animation(
        this.body.scale, 
        {
          x: 1, 
          y: 1,
          z: 1
        }, 0.3, 'Linear', (data) => {
          this.body.scale[data.prop] = data.value;
      }, 0.2);
    }
  }
}


export default new Bottle();