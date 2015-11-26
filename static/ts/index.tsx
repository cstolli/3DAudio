/// <reference path="../../typings/tsd.d.ts" />

var three = require('n3d-threejs');
var jquery = require('jquery');

export default function app() {
	
	let [scene, camera, light, renderer] = init();
	draw(scene);
	animate(scene, camera, light, renderer);
	
}

function init():any {
	
	let  camera = new three.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.y = 400;
	let scene = new three.Scene();
	var light = new three.DirectionalLight( 0xffffff, 0.8 );
	
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );
	
	let container = document.createElement( 'div' );
	jquery('body').append(container);
	
	let renderer = new three.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', () => {
		onWindowResize(camera, renderer);
	}), false );
	
	
	return [scene, camera, light, renderer];
}

function draw(scene) {
	let geometry = new three.BoxGeometry(100, 100, 100);
	let material = new three.MeshNormalMaterial();
	let mesh = new three.Mesh(geometry, material);
	scene.add( mesh );
}

function animate(scene, camera, light, renderer) {

	requestAnimationFrame( () => {
		animate(scene, camera, light, renderer);
	});

	render(scene, camera, light, renderer);
}

function render(scene, camera, light, renderer) {

	var timer = Date.now() * 0.0001;

	camera.position.x = Math.cos( timer ) * 800;
	camera.position.z = Math.sin( timer ) * 800;

	camera.lookAt( scene.position );

	for ( var i = 0, l = scene.children.length; i < l; i ++ ) {

		var object = scene.children[ i ];

		object.rotation.x = timer * 5;
		object.rotation.y = timer * 2.5;

	}

	renderer.render( scene, camera );

}
function onWindowResize(camera, renderer) {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

app();