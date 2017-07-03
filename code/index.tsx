import * as THREE from 'three'
import * as jquery from 'jquery'
import * as _ from 'lodash'

import AudioPlayer from './audio';
import Visualizer from './visualizer';
import Loader from './loader';

interface ICameras{
  main:THREE.PerspectiveCamera;
}

interface ILights{
  main:THREE.DirectionalLight;
}

declare function require(path: string)

require("../styles/index.less");

export default class App {

	private scene: THREE.Scene;
	private cameras: ICameras;
	private lights: ILights;
  private audio: AudioPlayer;
	private renderer: THREE.WebGLRenderer;
	private container: HTMLElement;
	private visualizer: Visualizer;
  private loader:Loader;

  constructor() {
		this.createScene();
		this.createCamera();
		this.createLights();
		this.createRenderer();
    this.createAudio();

    this.loader = new Loader();

    var request = this.loader.getRequest();
    request.onload = (data)=>{
      this.audio.createContext(request.response, ()=>{
        this.createVisualizer();
        this.visualizer.draw();
        this.bindEvents();
        this.animate();
        //this.audio.getSource().start(0);
      });
    };
    this.loader.load('04_Clap.mp3');
	}

	createScene():void {
  	this.container = document.createElement( 'div' );
  	this.container.className = 'scene-theatre';
    document.body.appendChild(this.container);
  	this.scene = new THREE.Scene();
	}

	createCamera():void {
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 10;
    camera.position.z = 10;
    this.cameras = {
        'main': camera,
    };
    this.cameras.main.lookAt( this.scene.position );
    //camera.position.set(.707, 0.7, 10);
  }

	createLights():void {
		let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
		light.position.set( 1, 1, 1 ).normalize();
		this.lights = {
      'main': light,
    };
		this.scene.add( light );
	}

	createRenderer():void {
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
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
    this.visualizer = new Visualizer({
      analyser:this.audio.getAnalyzer(),
      scene:this.scene,
      light: this.lights['main'],
    });
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

  render():void {

    var timer = Date.now() * 0.0001;
    this.visualizer.visualize(this.visualizer.getMesh('cube'));
    this.renderer.render(this.scene, this.cameras.main);
  }
}

let app = new App();
