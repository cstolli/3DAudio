
var _  = require('lodash');

interface IAudioOptions {
    file: string,
    controls?: boolean;
}

export default class AudioPlayer {

    private element:HTMLAudioElement;
    private container:HTMLDivElement;

    public static Path:string = '../audio/';
    public static FFTSize:number = 256;

    private options:IAudioOptions;

    private context:AudioContext;
    private source:MediaElementAudioSourceNode;
    private analyser:AnalyserNode;

    constructor(options:IAudioOptions) {

        this.options = _.extend({
            controls: true,
        }, options);

        this.createElements();
        this.createContext();
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = 'orchestra-pit';

        this.element = document.createElement('audio');
        this.element.className = 'orchestra';
        this.element.src = AudioPlayer.Path + this.options.file;
        this.element.controls = this.options.controls;

        this.container.appendChild(this.element);
    }

    public getElement() {
        return this.element;
    }

    public getContainer() {
        return this.container;
    }

    private createContext() {
        this.context = new AudioContext();
        this.source = this.context.createMediaElementSource(this.element);
        this.analyser = this.context.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
    }

    private createAnalyzer() {
        this.analyser.fftSize = AudioPlayer.FFTSize;
    }

    getAnalyzer() {
        return this.analyser;
    }
}