import camera from './camera';

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
    // this.renderer.setSize(400, 400);
  }

  render() {
    this.renderer.render(this.instance, this.camera.instance);
  }
}

export default new Scene();