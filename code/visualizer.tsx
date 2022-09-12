import * as _ from 'lodash'
import * as THREE from 'three'
import TextGeometry, { BMFont, BMFontJsonParser, TextGeometryOption, TextAlign } from 'three-text-geometry'

interface IVisualizerOptions {
  analyser: AnalyserNode;
  scene: THREE.Scene;
  light: THREE.DirectionalLight;
}

export default class Visualizer {

  private options:IVisualizerOptions;
  private analyser:AnalyserNode;
  private bufferLength: number;
  private dataArray:Uint8Array;
  private scene:THREE.Scene;
  private meshes:THREE.Mesh[];
  private container:THREE.Object3D;

  constructor(options:IVisualizerOptions) {
    this.options = options;
    this.scene = this.options.scene;
    this.analyser = this.options.analyser;
    this.bufferLength = this.analyser.frequencyBinCount;
    const minDecibels = -90;
    const maxDecibels = 6;
    this.meshes = [];
    this.container = new THREE.Object3D();
    this.scene.add(this.container);
    this.analyser.minDecibels = minDecibels;
    this.analyser.maxDecibels = maxDecibels;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  getMesh(name:string) {
    return this.meshes[name];
  }

  draw() {
    for (let x = 0; x < this.analyser.frequencyBinCount; x++) {
      this.drawFrequencyBar(x);
    }
    let box:any = new THREE.Box3().setFromObject(this.container);
    const size = new THREE.Vector3();
    box.getSize(size)
    this.container.position.x = -size.x / 2;
  }

  drawFrequencyBar(x) {
    let geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.25, 20);
    
    let material = new THREE.MeshPhongMaterial({
      color: 0x2194ce,
      specular: 0xffffff,
      emissive: 0x000000,
      shading: THREE.SmoothShading,
      shininess: 100,
    });
    let mesh = new THREE.Mesh(geometry, material);
    let group = new THREE.Group();
    group.add(mesh)
    this.meshes.push(group);
    group.position.set(x / 2 + (0.1 * x), 0, 0);
    this.container.add(group);
  }

  visualize(element:THREE.Object3D) {

    this.analyser.getByteFrequencyData(this.dataArray);
    let average = _.reduce(this.dataArray, (value, seed) => {
      return value + seed;
    }, 0) / this.dataArray.length + 100;
    let range = this.analyser.maxDecibels - this.analyser.minDecibels;
    let percent = average / range;
    this.options.light.intensity = percent + .3;

    for(var i = 0; i < this.bufferLength; i++) {
      let mesh = this.meshes[i].children[0];
      if (this.dataArray[i] !== 0) {
        mesh.scale.y = this.dataArray[i] / 10;
        mesh.geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        mesh.geometry.boundingBox.getSize(size);
        let height = size.y;
        mesh.position.y = height * mesh.scale.y / 2;
      }
    }
  }
}
