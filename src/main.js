import * as THREE from '../libs/three.js';
window.THREE = THREE;

class Main {
  constructor() {};
  init() {
    const width = document.body.style.width.replace('px', '');
    const height = document.body.style.height.replace('px', '');

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2,
    height / 2, -height / 2, -1000, 1000);

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
    scene.add(mesh);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let currentAngle = 0;
    let lastTimestamp = Date.now();

    function animate () {
      var now = Date.now();
      var duration = now - lastTimestamp;
      lastTimestamp = now;
      currentAngle = currentAngle + duration / 1000 * Math.PI;// 2s转一圈
      if(currentAngle >= 2 * Math.PI) currentAngle = 0;
    }

   function render () {
      animate();
      mesh.rotation.set(0, 0, currentAngle);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  };
}

export default new Main();