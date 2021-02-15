import blockConf from '../confs/block-conf';
import Animation from '../../libs/animation';

export default class BaseBlock {
  constructor (type, width = blockConf.width) {
    this.type = type; // cuboid | cylinder
    this.height = blockConf.height;
    this.width = width;
    this.state = 'stop';
    this.scale = 1;
  }

  shrink() {
    this.state = 'shrink';
  }

  doShrink() {
    const DELTA_SCALE = 0.005;
    const MIN_SCALE = 0.55;
    const nextScale = this.scale - DELTA_SCALE;
    this.scale = Math.max(nextScale, MIN_SCALE);
    if(this.scale <= MIN_SCALE) {
      return this.state = 'stop';
    }
    this.instance.scale.y = this.scale;
    this.instance.position.y = this.height * this.scale / 2;
  }

  rebound() {
    this.state = 'stop';
    this.scale = 1;
    Animation({scale: this.instance.scale.y}, {scale: 1}, 0.5, 'ElasticEaseOut', (data) => {
      this.instance.scale.y = data.value;
    });
    Animation({y: this.instance.position.y}, {y: this.height / 2}, 0.5, 'ElasticEaseOut', (data) => {
      this.instance.position.y = data.value;
    });
  }

  update() {
    if(this.state === 'shrink') {
      this.doShrink() 
    }
  }

  getVertices () {
    const vertices = [];
    const centerPosition = {
      x: this.instance.position.x,
      z: this.instance.position.z
    };
    vertices.push([centerPosition.x + this.width / 2, centerPosition.z + this.width / 2]);
    vertices.push([centerPosition.x + this.width / 2, centerPosition.z - this.width / 2]);
    vertices.push([centerPosition.x - this.width / 2, centerPosition.z + this.width / 2]);
    vertices.push([centerPosition.x - this.width / 2, centerPosition.z - this.width / 2]);
    return vertices;
  }
}