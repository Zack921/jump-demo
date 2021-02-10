import BaseBlock from './base';

export default class CylinderBlock extends BaseBlock{
  constructor (x, y, z, r, height) {
    super('cylinder');
    r = r || this.width / 2;
    height = height || this.height;
    var geometry = new THREE.CylinderGeometry(r, r, height, 120);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff
    })
    this.instance = new THREE.Mesh( geometry, material );
    this.instance.name = 'block';
    this.instance.position.x = x;
    this.instance.position.y = y;
    this.instance.position.z = z;
    
    this.instance.receiveShadow = true;
    this.instance.castShadow = true;
  }
}