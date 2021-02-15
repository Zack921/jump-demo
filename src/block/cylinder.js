import BaseBlock from './base';

export default class CylinderBlock extends BaseBlock{
  constructor (x, y, z, width) {
    super('cylinder', width);
    const r = this.width / 2;
    var geometry = new THREE.CylinderGeometry(r, r, this.height, 120);
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