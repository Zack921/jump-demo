import BaseBlock from './base';

export default class CuboidBlock extends BaseBlock{
  constructor (x, y, z, width) {
    super('cuboid', width);
    const size = this.width;
    var geometry = new THREE.BoxGeometry(size, this.height, size);
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