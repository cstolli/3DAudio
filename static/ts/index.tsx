/// <reference path="../../typings/tsd.d.ts" />
import THREE = require('n3d-threejs');

let geometry = new THREE.BoxGeometry(100, 100, 100);
let material = new THREE.MeshNormalMaterial();
let mesh = new THREE.Mesh(geometry, material);

let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );

let scene = new THREE.Scene();

var light = new THREE.DirectionalLight( 0xffffff, 1 );

light.position.set( 1, 1, 1 ).normalize();
scene.add( light );
