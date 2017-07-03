import * as _ from 'lodash'
import * as  noteFreqs from './note-frequencies'

interface IAudioOptions {
    file: string,
    controls?: boolean;
}

interface IAudioControls {
    play:HTMLElement;
    stop:HTMLElement;
}

interface IKey {
    el: HTMLElement;
    note: string;
}


export default class AudioPlayer {

    private element:HTMLAudioElement;
    private container:HTMLDivElement;

    public static Path:string = '../audio/';
    public static FFTSize:number = 64;

    public static Smoothing:number = 0.5;

    private options:IAudioOptions;

    private buffer:AudioBuffer;

    private context:AudioContext;
    private source:AudioBufferSourceNode;
    private analyser:AnalyserNode;

    private keys:IKey[];

    private oscillators:Object;

    private controls:IAudioControls;

    constructor(options:IAudioOptions) {

        this.options = _.extend({
            controls: true,
        }, options);

        this.oscillators = {};

        this.createElements();
        this.createKeys();
        this.bindControls();

    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = 'orchestra-pit';

        let play = document.createElement('button');
        play.className = 'play-button';
        play.innerHTML = 'ROck ON BROuh';

        let stop = document.createElement('button');
        stop.innerHTML = 'Stop';
        stop.className = 'stop';

        this.controls = {
            play,
            stop
        };

        this.container.appendChild(play);
        this.container.appendChild(stop);
    }

    createKeys() {
        this.keys = []

        let keyboard = document.createElement('div');
        keyboard.className = 'keyboard';
        let notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

        notes.forEach((note)=>{
            let el:HTMLElement = document.createElement('div')
            el.className = 'note ' + note;
            el.innerHTML = note;
            this.keys.push({
                el,
                note
            });
            keyboard.appendChild(el);
            el.onmousedown = (event)=>{
                el.className += ' pressed';
                this.playSound(note);
            };

            el.onmouseup = (event)=>{
                el.className = 'note ' + note;
                this.stopSound(note);
            };
        });
        this.container.appendChild(keyboard);
    }

    getNoteFromKey(event:any):string {

        let note = String.fromCharCode(event.which).toUpperCase();

        if (event.shiftKey) {
            note += "#"
        }

        note += "3";
        console.log(`Code ${event.which}. Char ${String.fromCharCode(event.which)}. Note ${note}`);

        return note;
    }

    playSound(note):void {

        let freq = noteFreqs[note];
        let osc = this.oscillators[''+freq]
        if (freq && !osc) {
            var oscillator = this.context.createOscillator();
            oscillator.type = 'triangle';
            //sine
            //square
            //sawtooth
            //triangle
            oscillator.frequency.value = freq;
            oscillator.connect(this.context.destination);
            oscillator.start();
            this.oscillators[freq+''] = oscillator;
        }
    }

    stopSound(note):void {
        let freq = noteFreqs[note];
        if (freq) {
            this.oscillators[freq+''].stop();
            this.oscillators[freq+''] = null;
        }
    }

    public getElement() {
        return this.element;
    }

    public getContainer() {
        return this.container;
    }

    createContext(data, callback):any {
        this.context = new AudioContext();
        this.source = this.context.createBufferSource();
        let promise = this.context.decodeAudioData(data, (buffer:any)=>{
            this.buffer = buffer;
            this.source.buffer = this.buffer;
            this.createAnalyser();
            //this.source.connect(this.analyser);
            this.analyser.connect(this.context.destination);
            callback();
        });
        return promise;
    }

    bindControls():void {
      this.controls.play.onclick = ()=>{
        this.source = this.context.createBufferSource();
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.source.buffer = this.buffer;
        this.source.start(0);
      };

      this.controls.stop.onclick = ()=>{
        this.getSource().stop();
      };

      document.onkeydown = (event)=>{
         // create Oscillator node
         if (this.isValidKey(event)) {
           let note = this.getNoteFromKey(event);
           this.playSound(note);
         }
      };

      document.onkeyup = (event)=>{
         let note = this.getNoteFromKey(event);
         this.stopSound(note);
      };
    }

    private isValidKey(event) {
        return event.which !== 16;
    }


    private createAnalyser():void {
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = AudioPlayer.FFTSize;
    }

    getAnalyzer() {
        return this.analyser;
    }

    getSource() {
        return this.source;
    }
}
