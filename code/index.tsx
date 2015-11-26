/// <reference path="../typings/tsd.d.ts"/>

var three = require('n3d-threejs');
var jquery = require('jquery');
var _ = require('lodash');

import AudioPlayer from './audio';
import Visualizer from './visualizer';

require("!style!css!less!../styles/index.less");

interface ICameras{
    main:THREE.PerspectiveCamera;
}

interface ILights{
    main:THREE.Light;
}

export default class App {

	private scene: THREE.Scene;
	private cameras: ICameras;
	private lights: ILights;
    private audio: AudioPlayer;
	private renderer: THREE.WebGLRenderer;
	private container: HTMLElement;
	private visualizer: Visualizer;
    private meshes:Object;

	constructor() {
		this.createScene();
		this.createCamera();
		this.createLights();
		this.createRenderer();
        this.createAudio();
        this.createVisualizer();
		this.bindEvents();
		this.draw();
		this.animate();
	}

	createScene():void {
		this.container = document.createElement( 'div' );
		this.container.className = 'scene-theatre';
        document.body.appendChild(this.container);
		this.scene = new three.Scene();
	};

	createCamera():void {
        let camera = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.y = 10;
        camera.position.z = 10;
        this.cameras = {
            'main': camera,
        }
        //camera.position.set(.707, 0.7, 10);
    }

	createLights():void {
		let light = new three.DirectionalLight( 0xffffff, 0.8 );
		light.position.set( 1, 1, 1 ).normalize();
		this.lights = {
            'main': light,
        };
		this.scene.add( light );
	}

	createRenderer():void {
		this.renderer = new three.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.container.appendChild(this.renderer.domElement);
	}

    createAudio():void {
        let audioOptions = {file: '04_Clap.mp3'};
        this.audio = new AudioPlayer(audioOptions);
        this.container.appendChild(this.audio.getContainer());
    }

    createVisualizer():void{
        this.visualizer = new Visualizer({analyser:this.audio.getAnalyzer()});
    }

	draw() {
		let geometry = new three.BoxGeometry(100, 100, 100);
		let material = new three.MeshNormalMaterial();
		let mesh = new three.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        this.meshes = {
            'cube': mesh
        };
		this.scene.add( mesh );

        var size = 10;
        var step = 1;

        //var gridHelper = new three.GridHelper( size, step );
        //gridHelper.position.set(0, 0, 0);
        //gridHelper.setColors(0xcccccc, 0xffffff);
        //this.scene.add( gridHelper );
	}

	bindEvents():void {
		window.addEventListener( 'resize', this.onWindowResize.bind(this));
	}

	onWindowResize():void {

        _.forEach(this.cameras, (camera)=> {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
		});

		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

    animate():void {

        requestAnimationFrame( () => {
            this.animate();
        });

        this.render();
    }

    getMesh(name:string) {
        return this.meshes[name];
    }

    render():void {

        var timer = Date.now() * 0.0001;

        this.cameras.main.position.x = Math.cos( timer ) * 800;
        this.cameras.main.position.z = Math.sin( timer ) * 800;

        this.cameras.main.lookAt( this.getMesh('cube').position );

        for ( var i = 0, l = this.scene.children.length; i < l; i ++ ) {
            var object = this.scene.children[ i ];
            object.rotation.x = timer * 5;
            object.rotation.y = timer * 2.5;
            object.position.x = 500;
            object.scale.x = 1000;
            this.visualizer.visualize(this.getMesh('cube'));
        }


        this.renderer.render(this.scene, this.cameras.main);
    }
}

let app = new App();