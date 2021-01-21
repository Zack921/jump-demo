export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks;
  }

  init() {
    console.log('game page init');
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-width / 2, width / 2,
    height / 2, -height / 2, -1000, 1000);
  }

  show() {
    console.log('game page show');
    setTimeout(() => {
      this.callbacks.showGameOverPage();
    }, 2000);
    this.testTriggle();
  }

  hide() {
    console.log('game page hide');
  }

  testTriggle() {

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(400, 400);

    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 100);
    triangleShape.lineTo(-100, -100);
    triangleShape.lineTo(100, -100);
    triangleShape.lineTo(0, 100);

    const geometry = new THREE.ShapeGeometry(triangleShape);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;
    this.scene.add(mesh);

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 5;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    let currentAngle = 0;
    let lastTimestamp = Date.now();

    function animate () {
      var now = Date.now();
      var duration = now - lastTimestamp;
      lastTimestamp = now;
      currentAngle = currentAngle + duration / 1000 * Math.PI;// 2s转一圈
      if(currentAngle >= 2 * Math.PI) currentAngle = 0;
    }

    const render = () => {
      animate();
      mesh.rotation.set(0, 0, currentAngle);
      renderer.render(this.scene, this.camera);
      requestAnimationFrame(render);
    }

    render();
  }
}